// dotnet run --file tmp/test.cs
// dotnet run --file tmp/test.cs hello world

using System;

var values = args.Length == 0 ? new[] { "hello", "world" } : args;

Console.WriteLine($"Received {values.Length} value(s).");
foreach (var value in values)
{
	Console.WriteLine($"- {Describe(value)}");
}

string Describe(string value) => value switch
{
	null => "null",
	{ Length: 0 } => "empty",
	{ Length: 1 } => $"one character: {value}",
	_ => $"{value} ({value.Length} characters)"
};
