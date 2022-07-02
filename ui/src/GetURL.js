import { parseDomain, ParseResultType } from 'parse-domain';

export default function GetURL() {
    if (process.env.NODE_ENV === 'development') {
        return "http://localhost:5000";
    }
    const parseResult = parseDomain(window.location.href);

    if (parseResult.type === ParseResultType.Listed) {
        const { subDomains, domain, topLevelDomains } = parseResult;

        subDomains.shift();
        let url = [...subDomains, domain, ...topLevelDomains].join('.');
        return url;
    }
    return "";
}