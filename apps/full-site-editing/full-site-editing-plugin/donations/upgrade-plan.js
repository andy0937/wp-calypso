/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, ExternalLink, Placeholder } from '@wordpress/components';

/**
 * Internal dependencies
 */

const UpgradePlan = ( { upgradeUrl } ) => {
	return (
		<div className={ 'donations__upgrade-plan' }>
			<Placeholder
				icon="lock"
				label={ __( 'Donations', 'full-site-editing' ) }
				instructions={ __(
					"You'll need to upgrade your plan to use the Donations block.",
					'full-site-editing'
				) }
			>
				<Button
					/**
					 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/42883
					 */
					// @ts-ignore isSecondary is missing from the type definition
					isSecondary
					isLarge
					href={ upgradeUrl }
					target="_blank"
					className="premium-content-block-nudge__button plan-nudge__button"
				>
					{ __( 'Upgrade Your Plan', 'full-site-editing' ) }
				</Button>
				<div className="membership-button__disclaimer">
					<ExternalLink href="https://wordpress.com/support/donations-block/">
						{ __( 'Read more about Donations and related fees.', 'full-site-editing' ) }
					</ExternalLink>
				</div>
			</Placeholder>
		</div>
	);
};

export default UpgradePlan;
