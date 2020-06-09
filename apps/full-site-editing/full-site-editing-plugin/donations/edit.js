/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import UpgradePlan from './upgrade-plan';
import fetchStatus from './fetch-status';

const API_STATE_LOADING = 0;
const API_STATE_CONNECTED = 1;
const API_STATE_NOTCONNECTED = 2;

const Edit = () => {
	const [ activeTab, setActiveTab ] = useState( 'one-time' );
	const [ products, setProducts ] = useState( [] );
	const [ connectURL, setConnectURL ] = useState( null );
	const [ apiState, setApiState ] = useState( API_STATE_LOADING );
	const [ shouldUpgrade, setShouldUpgrade ] = useState( false );
	const [ upgradeURL, setUpgradeURL ] = useState( '' );
	const [ siteSlug, setSiteSlug ] = useState( '' );

	useEffect( () => updateData() );

	const updateData = () => {
		fetchStatus().then( mapStatusToState, apiError );
	};

	const mapStatusToState = ( result ) => {
		if ( ! result && typeof result !== 'object' ) {
			return;
		}
		if (
			result.errors &&
			Object.values( result.errors ) &&
			Object.values( result.errors )[ 0 ][ 0 ]
		) {
			setApiState( API_STATE_NOTCONNECTED );
			onError( props, Object.values( result.errors )[ 0 ][ 0 ] );
			return;
		}

		setConnectURL( result.connect_url );
		setShouldUpgrade( result.should_upgrade_to_access_memberships );
		setUpgradeURL( result.upgrade_url );
		setSiteSlug( result.site_slug );

		if (
			result.products &&
			result.products.length === 0 &&
			! result.should_upgrade_to_access_memberships &&
			result.connected_account_id
		) {
			// Is ready to use and has no product set up yet. Let's create one!
			savePlan(
				{
					newPlanCurrency: 'USD',
					newPlanPrice: 5,
					newPlanName: __( 'Monthly Subscription', 'full-site-editing' ),
					newPlanInterval: '1 month',
				},
				() => {
					setApiState( result.connected_account_id ? API_STATE_CONNECTED : API_STATE_NOTCONNECTED );
				}
			);
			return;
		} else if ( result.products && result.products.length > 0 ) {
			setProducts( result.products );
			if ( ! props.attributes.selectedPlanId ) {
				selectPlan( result.products[ 0 ] );
			}
		}
		setApiState( result.connected_account_id ? API_STATE_CONNECTED : API_STATE_NOTCONNECTED );
	};

	const apiError = ( message ) => {
		setConnectURL( null );
		setApiState( API_STATE_NOTCONNECTED );
		onError( props, message );
	};

	const isActive = ( button ) => ( activeTab === button ? 'active' : null );

	return shouldUpgrade ? (
		<UpgradePlan upgradeUrl={ upgradeURL } />
	) : (
		<div className="donations__container">
			<Button className={ isActive( 'one-time' ) } onClick={ () => setActiveTab( 'one-time' ) }>
				{ __( 'One-Time', 'full-site-editing' ) }
			</Button>
			<Button className={ isActive( 'monthly' ) } onClick={ () => setActiveTab( 'monthly' ) }>
				{ __( 'Monthly', 'full-site-editing' ) }
			</Button>
			<Button className={ isActive( 'annually' ) } onClick={ () => setActiveTab( 'annually' ) }>
				{ __( 'Annually', 'full-site-editing' ) }
			</Button>
			<div
				id="donations__tab-one-time"
				className={ classNames( 'donations__tab', { active: isActive( 'one-time' ) } ) }
			>
				{ __( 'One time', 'full-site-editing' ) }
			</div>
			<div
				id="donations__tab-monthly"
				className={ classNames( 'donations__tab', { active: isActive( 'monthly' ) } ) }
			>
				{ __( 'Monthly', 'full-site-editing' ) }
			</div>
			<div
				id="donations__tab-annually"
				className={ classNames( 'donations__tab', { active: isActive( 'annually' ) } ) }
			>
				{ __( 'Annually', 'full-site-editing' ) }
			</div>
		</div>
	);
};

export default Edit;
