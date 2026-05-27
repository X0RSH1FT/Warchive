---
name: scan-lan-devices
description: Inventory devices on a local network from Windows using passive neighbor-table reads, bounded host discovery, or a small ping sweep. Use when you need a basic LAN device scan on a network you own or administer.
argument-hint: "[CIDR for nmap, or a three-octet IPv4 prefix plus host range for the PowerShell helper]"
---

# Scan LAN Devices

Use this skill for a basic, bounded inventory of devices on a local network that you own, administer, or have explicit permission to inspect.

Stop and clarify before running commands if network ownership is unclear, the requested scope expands beyond the local subnet, or the user asks for intrusive scanning rather than host discovery. If the request turns into port scanning, service fingerprinting, or wider-range network assessment, treat that as a different workflow instead of extending this skill in place.

## Workflow

1. Confirm the target subnet, whether the user wants passive discovery only or active host discovery, and whether `nmap` is installed.
2. Prefer passive discovery first so you can surface already-known neighbors without sending new traffic.
3. Keep passive results filtered to the requested subnet before reporting them.
4. If active discovery is needed, keep it bounded to host discovery only. Do not widen this skill into port scanning or service discovery.
5. Report only what the commands actually show: IP address, MAC address when available, interface, and reachability. Do not guess device identity.

## Preferred Commands On Windows

Passive discovery:

- `Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like '192.168.1.*' } | Format-Table IPAddress, PrefixLength, InterfaceAlias -AutoSize`
- `Get-NetNeighbor -AddressFamily IPv4 | Where-Object { $_.IPAddress -like '192.168.1.*' } | Format-Table IPAddress, LinkLayerAddress, State, InterfaceAlias -AutoSize`
- `arp -a | Select-String '192\.168\.1\.'`

Active host discovery:

- If `nmap` is available: `nmap -sn 192.168.1.0/24`
- If `nmap` is not available and the target is a /24-style subnet, use the helper script in [scan-subnet.ps1](scan-subnet.ps1) with a three-octet IPv4 prefix and bounded host range

## Supporting Resource

Use [scan-subnet.ps1](scan-subnet.ps1) for a bounded PowerShell ping sweep when `nmap` is unavailable and the target can be expressed as a three-octet IPv4 prefix such as `192.168.1`.

Example:

```powershell
.\scan-subnet.ps1 -SubnetPrefix 192.168.1 -StartHost 1 -EndHost 32
```

## Validation

1. Start with the smallest relevant command for the requested scope.
2. If using the helper script, run it against a narrow host range first.
3. Confirm that any reported neighbors or reachable hosts are grounded in actual command output.
4. If the requested subnet is not a /24-style range and `nmap` is unavailable, stop and clarify instead of guessing how to expand the helper.

## Boundaries

- Keep the workflow on a single local subnet. If the user needs wider scope, stop and treat that as a different workflow.
- Prefer inventory and reachability over intrusive scans.
- On Windows, prefer PowerShell-native commands before adding external tool dependencies.