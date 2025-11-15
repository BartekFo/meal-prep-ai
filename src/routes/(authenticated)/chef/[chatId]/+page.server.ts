import { getChatById, getMessagesByChatId } from '$lib/modules/chef/db/queries';
import { error } from '@sveltejs/kit';
import { ok, safeTry } from 'neverthrow';

function isMobileDevice(userAgent: string): boolean {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

export async function load({ locals: { user }, params, request }) {
	if (!user) {
		error(401, { message: 'User not authenticated' });
	}

	const chatId = params.chatId;
	return safeTry(async function* () {
		const chat = yield* getChatById({ id: chatId, userId: user.id }).mapErr(() =>
			error(404, 'Not found')
		);
		if (!chat) {
			error(404, { message: 'Chat not found' });
		}
		const messages = yield* getMessagesByChatId({ id: chatId });
		const userAgent = request.headers.get('user-agent') || '';
		const isMobile = isMobileDevice(userAgent);

		return ok({ chat, messages, isMobile });
	}).match(
		(result) => result,
		() => error(500, 'An error occurred while processing your request')
	);
}
