export class Protocol
{
    name: string;
    color: string;
    invert: string;
}
export class SecuConstants
{
    // Guyancourt
    public static HqLat = 48.761719;
    public static HqLng = 2.062909;
    // Marseille
    // lat = 43.2969500;
    // lng = 5.3810700;

    // Presque Nice
    // lat = 44; // 43.7031300;
    // lng = 9.5; // 7.2660800;

    private static protocols: Protocol[] = [
        {
            name: 'FTP',
            color: '#ff0000',
            invert: 'white'
        },
        {
            name: 'SSH',
            color: '#ff8000',
            invert: 'white'
        },
        {
            name: 'TELNET',
            color: '#ffff00',
            invert: 'black'
        },
        {
            name: 'EMAIL',
            color: '#80ff00',
            invert: 'white'
        },
        {
            name: 'WHOIS',
            color: '#00ff00',
            invert: 'white'
        },
        {
            name: 'DNS',
            color: '#00ff80',
            invert: 'white'
        },
        {
            name: 'HTTP',
            color: '#00ffff',
            invert: 'black'
        },
        {
            name: 'HTTPS',
            color: '#0080ff',
            invert: 'white'
        },
        {
            name: 'SQL',
            color: '#0000ff',
            invert: 'white'
        },
        {
            name: 'SNMP',
            color: '#8000ff',
            invert: 'white'
        },
        {
            name: 'SMB',
            color: '#bf00ff',
            invert: 'white'
        },
        {
            name: 'AUTH',
            color: '#ff00ff',
            invert: 'white'
        },
        {
            name: 'RDP',
            color: '#ff0060',
            invert: 'white'
        },
        {
            name: 'DOS',
            color: '#ff0000',
            invert: 'white'
        },
        {
            name: 'ICMP',
            color: '#ffcccc',
            invert: 'white'
        },
        {
            name: 'TCP',
            color: '#ffcccc',
            invert: 'white'
        },
        {
            name: 'OTHER',
            color: '#6600cc',
            invert: 'white'
        }
    ];
    public static Protocols: Map<string, Protocol> = new Map<string, Protocol>(SecuConstants.protocols.map((p: Protocol) => [p.name, p]));

    public static ZoomLevel = 2;
}
