import { browser } from 'k6/browser';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";


export const options = {
    scenarios: {
        ui: {
            executor: 'per-vu-iterations',
            vus: 50,
            iterations: 1,
            options: {
                browser: {
                    type: 'chromium',
                    cache: false,
                    // isHeadless: false,
                },
            },
        },
    },
    thresholds: {
        'browser_web_vital_lcp': ['p(75)<2500'],
        'browser_web_vital_cls': ['p(75)<0.1'],
        'browser_web_vital_ttfb': ['p(75)<800'],
        'browser_web_vital_fcp': ['p(75)<1800'],
        'browser_web_vital_inp': ['p(75)<200'],
    },
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(75)', 'p(90)', 'p(95)']
};

export default async function () {
    const page = await browser.newPage();
    const startTime = Date.now();

    try {
        await page.goto(`https://www.staging.conceiveabilities.com/`);
        const loadTime = Date.now() - startTime;
        console.log(loadTime);

    } finally {
        await page.close();
    }
}

export function handleSummary(data) {
    // return {'mainPage.json': JSON.stringify(data)}
    return {
        "home_1_vu_PageLoad.html": htmlReport(data),
        'home_1_vu_PageLoad.json': JSON.stringify(data),
        stdout: textSummary(data),

    };
}
