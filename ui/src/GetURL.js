import { parseDomain, ParseResultType, fromUrl } from 'parse-domain';

export default function GetURL() {
    if (process.env.NODE_ENV === 'development') {
        return "http://localhost:5000";
    }
    const parseResult = parseDomain(fromUrl(window.location.href));

    if (parseResult.type === ParseResultType.Listed) {
        const { subDomains, domain, topLevelDomains } = parseResult;

        subDomains.shift();
        let url = ["spongecoin", ...subDomains, domain, ...topLevelDomains].join('.');
        return window.location.protocol + "//" + url;
    }
    return "";
}