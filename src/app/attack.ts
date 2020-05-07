import { SecuConstants } from "./secu.constants";

export class AttackWss
{
    timestamp: string;
    proto: number;
    protocol: string;
    src_ip: string;
    src_port: number;
    dst_ip: string;
    dst_port: number;
    src_geo: {
        lat: number;
        lng: number;
        country: string;
        city: string;
        iso_code: string;
    };
    dst_geo: {
        lat: number;
        lng: number;
        country: string;
        city: string;
        iso_code: string;
    };
}

export class Attack extends AttackWss
{
    private _color: string;
    get color () {
        return this._color;
    }

    public static mapperFromWss (source: AttackWss): Attack
    {
        const target = new Attack();

        Object.assign(target, source);

        target._color = Attack.chooseColor(source.protocol);

        return target;
    }

    private static chooseColor (protocol: string): string
    {
        const key = SecuConstants.Protocols.has(protocol) ? protocol : 'OTHER';

        return SecuConstants.Protocols.get(key).color;
    }
}
