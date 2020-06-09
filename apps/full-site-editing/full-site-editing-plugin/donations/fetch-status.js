/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */

const fetchStatus = async () => {
	try {
		const result = await apiFetch( {
			path: '/wpcom/v2/memberships/status',
			method: 'GET',
		} );
		console.log( JSON.parse( result ) );
		return JSON.parse( result.data );
	} catch ( error ) {
		return error.message;
	}
};

export default fetchStatus;
