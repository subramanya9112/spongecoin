import { parseDomain, ParseResultType, fromUrl } from 'parse-domain';

export default function GetURL() {
    if (process.env.NODE_ENV === 'development') {
        return "http://localhost:5000";
    }
    const parseResult = parseDomain(fromUrl(window.location.href));

    if (parseResult.type === ParseResultType.Listed) {
        const { subDomains, domain, topLevelDomains } = parseResult;

        subDomains.shift();
        let url = ["server", ...subDomains, domain, ...topLevelDomains].join('.');
        return window.location.protocol + "//" + url;
    } if (parseResult.type === ParseResultType.Reserved) {
        const labels = parseResult.labels;
        let url;
        labels.shift();
        url = ["server", ...labels].join('.');
        return window.location.protocol + "//" + url;
    }
    return "";
}