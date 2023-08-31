import { Logger } from '@gitbook/runtime';

import { queryLens } from '../actions/queryLens';
import type { SlashEvent } from '../commands';
import { SlackRuntimeContext } from '../configuration';

const logger = Logger('slack:api');

/**
 * Handle a slash request and route it to the GitBook Lens' query function.
 */
export async function queryLensSlashHandler(slashEvent: SlashEvent, context: SlackRuntimeContext) {
    // pull out required params from the slashEvent for queryLens
    const { team_id, channel_id, thread_ts, user_id, text } = slashEvent;

    try {
        return queryLens({
            channelId: channel_id,
            teamId: team_id,
            threadId: thread_ts,
            text,
            context,
            userId: user_id,
            messageType: 'ephemeral',
        });
    } catch (e) {
        // Error state. Probably no installation was found
        logger.error('Error calling queryLens. Perhasp no installation was found?');
        return {};
    }
}