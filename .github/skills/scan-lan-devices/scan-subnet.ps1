param(
    [Parameter(Mandatory = $true)]
    [string]$SubnetPrefix,

    [int]$StartHost = 1,

    [int]$EndHost = 254,

    [int]$TimeoutSeconds = 1
)

if ($StartHost -lt 1 -or $EndHost -gt 254 -or $StartHost -gt $EndHost) {
    throw "Choose a host range between 1 and 254 where StartHost is less than or equal to EndHost."
}

if ($TimeoutSeconds -lt 1) {
    throw "Choose a timeout of at least 1 second."
}

if ($SubnetPrefix -notmatch '^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$') {
    throw "Use a three-octet IPv4 prefix like 192.168.1."
}

$ping = New-Object System.Net.NetworkInformation.Ping

try {
    $results = foreach ($hostNumber in $StartHost..$EndHost) {
        $ipAddress = "$SubnetPrefix.$hostNumber"
        $reachable = $false

        try {
            $reply = $ping.Send($ipAddress, ($TimeoutSeconds * 1000))
            $reachable = $reply.Status -eq [System.Net.NetworkInformation.IPStatus]::Success
        }
        catch {
            $reachable = $false
        }

        if (-not $reachable) {
            continue
        }

        $neighbor = Get-NetNeighbor -IPAddress $ipAddress -ErrorAction SilentlyContinue |
            Select-Object -First 1 IPAddress, LinkLayerAddress, State, InterfaceAlias

        $linkLayerAddress = $null
        $state = $null
        $interfaceAlias = $null

        if ($null -ne $neighbor) {
            $linkLayerAddress = $neighbor.LinkLayerAddress
            $state = $neighbor.State
            $interfaceAlias = $neighbor.InterfaceAlias
        }

        [pscustomobject]@{
            IPAddress        = $ipAddress
            Reachable        = $true
            LinkLayerAddress = $linkLayerAddress
            State            = $state
            InterfaceAlias   = $interfaceAlias
        }
    }
}
finally {
    $ping.Dispose()
}

$results | Sort-Object @{ Expression = { [version]$_.IPAddress } } | Format-Table -AutoSize