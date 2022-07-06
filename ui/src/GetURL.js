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
    } if (parseResult.type === ParseResultType.Reserved) {
        const labels = parseResult.labels;
        let url;
        if (labels[0] === "client1") {
            labels.shift();
            url = ["server1", ...labels].join('.');
        } else {
            labels.shift();
            url = ["server2", ...labels].join('.');
        }
        return window.location.protocol + "//" + url;
    }
    return "";
}