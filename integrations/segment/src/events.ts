import * as api from '@gitbook/api';

import { version } from '../package.json';

export function generateSegmentTrackEvent(event: api.SpaceViewEvent) {
    const { visitor, referrer, url, spaceId, pageId } = event;

    const anonymousId = getAnonymousId(event);
    const visitedURL = new URL(url);
    return {
        event: '[GitBook] space_view',
        anonymousId,
        context: {
            library: {
                name: 'GitBook',
                version,
            },
            page: {
                path: visitedURL.pathname,
                search: visitedURL.search,
                url,
                referrer,
            },
            userAgent: visitor.userAgent,
            ip: visitor.ip,
        },
        properties: {
            spaceId,
            pageId,
        },
    };
}

/**
 * Return the anonymous ID we send to Segment in the Track event.
 *
 * Retrieve the value from the `ajs_anonymous_id` Segment cookie if present.
 * This allows to consolidate the track event with other events generated by an anonymous user
 * that already has visited the customer website (where Segment tracking is setup).
 *
 * When there is no `ajs_anonymous_id` cookie, we fallback to using the GitBook anonymous ID.
 */
function getAnonymousId(event: api.SpaceViewEvent): string {
    const { visitor } = event;
    const cookies = visitor.cookies;

    return cookies.ajs_anonymous_id || visitor.anonymousId;
}