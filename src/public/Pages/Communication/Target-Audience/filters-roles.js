export const setUuidProperties = (user, $item, repeaterType) => {

    isTopUser(user, $item, repeaterType);
    isPartnerUser(user, $item, repeaterType);
    isVeloUser(user, $item, repeaterType);
    isPremiumUser(user, $item, repeaterType);

    if (repeaterType === 'NeedApprove') {
        isAccountManaged(user, $item, repeaterType);
    }

    if (repeaterType === 'Rejected') {
        isContacted(user, $item, repeaterType);
        isChannels(user, $item, repeaterType);
        isB2B(user, $item, repeaterType);
        isUnsubscribed(user, $item, repeaterType);
    }
}

export const setSentUuidProperties = (user, $item, repeaterType) => {
    isSentTopUser(user, $item, repeaterType);
    isPartnerUser(user, $item, repeaterType);
    isVeloUser(user, $item, repeaterType);
    isPremiumUser(user, $item, repeaterType);
}

const isTopUser = (user, $item, repeaterType) => {
    isTopUserByCompanies(user) ?
        $item(`#V${repeaterType}TopUser`).hide() && $item(`#X${repeaterType}TopUser`).hide() && $item(`#seeDetails${repeaterType}TopUser`).show() :
        $item(`#V${repeaterType}TopUser`).hide() && $item(`#X${repeaterType}TopUser`).show() && $item(`#seeDetails${repeaterType}TopUser`).hide();
}

const isSentTopUser = (user, $item, repeaterType) => {
    isTopUserByCompanies(user) ?
        $item(`#V${repeaterType}TopUser`).show() && $item(`#X${repeaterType}TopUser`).hide() :
        $item(`#V${repeaterType}TopUser`).hide() && $item(`#X${repeaterType}TopUser`).show();
}

const isPartnerUser = (user, $item, repeaterType) => {
    user.partner_ind ?
        $item(`#V${repeaterType}Partner`).show() && $item(`#X${repeaterType}Partner`).hide() :
        $item(`#V${repeaterType}Partner`).hide() && $item(`#X${repeaterType}Partner`).show();
}

const isVeloUser = (user, $item, repeaterType) => {
    user.velo_ind ?
        $item(`#V${repeaterType}Velo`).show() && $item(`#X${repeaterType}Velo`).hide() :
        $item(`#V${repeaterType}Velo`).hide() && $item(`#X${repeaterType}Velo`).show();
}

const isPremiumUser = (user, $item, repeaterType) => {
    user.premium_ind ?
        $item(`#V${repeaterType}Premium`).show() && $item(`#X${repeaterType}Premium`).hide() :
        $item(`#V${repeaterType}Premium`).hide() && $item(`#X${repeaterType}Premium`).show();
}

const isAccountManaged = (user, $item, repeaterType = 'NeedApprove') => {
    if ($item(`#V${repeaterType}Managed`).isVisible) {
        user.managed_ind ?
            $item(`#V${repeaterType}Managed`).show() && $item(`#X${repeaterType}Managed`).hide() :
            $item(`#V${repeaterType}Managed`).hide() && $item(`#X${repeaterType}Managed`).show();
    }
}

const isContacted = async (user, $item, repeaterType = 'Rejected') => {
    if ($item(`#seeDetails${repeaterType}Contacted`).isVisible) {
        user.contacted_lately_ind ?
            $item(`#seeDetails${repeaterType}Contacted`).show() && $item(`#X${repeaterType}Contacted`).hide() && $item(`#V${repeaterType}Contacted`).hide() :
            $item(`#V${repeaterType}Contacted`).hide() && $item(`#X${repeaterType}Contacted`).show() && $item(`#seeDetails${repeaterType}Contacted`).hide();
    }
}

const isChannels = (user, $item, repeaterType = 'Rejected') => {
    if ($item(`#V${repeaterType}Channels`).isVisible) {
        user.channels_ind ?
            $item(`#V${repeaterType}Channels`).show() && $item(`#X${repeaterType}Channels`).hide() :
            $item(`#V${repeaterType}Channels`).hide() && $item(`#X${repeaterType}Channels`).show();
    }
}
const isB2B = (user, $item, repeaterType = 'Rejected') => {
    if ($item(`#V${repeaterType}B2B`).isVisible) {
        user.b2b_ind ?
            $item(`#V${repeaterType}B2B`).show() && $item(`#X${repeaterType}B2B`).hide() :
            $item(`#V${repeaterType}B2B`).hide() && $item(`#X${repeaterType}B2B`).show();
    }
}
const isUnsubscribed = (user, $item, repeaterType = 'Rejected') => {
    if ($item(`#X${repeaterType}Unsubscribe`).isVisible) {
        user.unqualified_for_emails_ind ?
            $item(`#V${repeaterType}Unsubscribe`).show() && $item(`#X${repeaterType}Unsubscribe`).hide() :
            $item(`#V${repeaterType}Unsubscribe`).hide() && $item(`#X${repeaterType}Unsubscribe`).show();
    }
}

const isTopUserByCompanies = (user) => {
    return isTopUserByMobileApps(user) ||
        isTopUserByBookings(user) ||
        isTopUserByBlog(user) ||
        isTopUserByGroups(user) ||
        isTopUserByPayments(user) ||
        isTopUserBySiteSuccess(user) ||
        isTopUserByForum(user) ||
        isTopUserByPromote(user) ||
        isTopUserByStores(user) ||
        isTopUserByRestaurants(user) ||
        isTopUserByEvents(user) ||
        isTopUserByViewer(user) ||
        isTopUserByPricingPlans(user)
}

export const isTopUserByMobileApps = (user) => user.mobile_apps_top_engagement || user.mobile_apps_top_traffic || user.mobile_apps_top_gpv;
export const isTopUserByBlog = (user) => user.blog_post_views || user.blog_paid_post_gpv;
export const isTopUserByBookings = (user) => user.booking_online_gpv || user.booking_participants || user.booking_total_gpv || user.booking_mixed;
export const isTopUserByEvents = (user) => user.events_top_gpv || user.events_top_rsvp
export const isTopUserByPayments = (user) => user.payments_pbw_top_merchant_rank || user.payments_wp_top_merchant_rank
export const isTopUserByForum = (user) => user.forum_zscore
export const isTopUserByGroups = (user) => user.groups_engagement
export const isTopUserByPromote = (user) => user.promote_top_social_marketing
export const isTopUserByRestaurants = (user) => user.restaurants_rank_by_30_days_online_gpv || user.restaurants_rank_by_7_days_online_gpv || user.restaurants_rank_by_90_days_online_gpv
export const isTopUserByStores = (user) => user.stores_top_gpv
export const isTopUserByViewer = (user) => user.viewer_top_sessions
export const isTopUserByPricingPlans = (user) => user.pricing_plans_top_gpv
export const isTopUserBySiteSuccess = (user) => user.site_success_top_gpv || user.site_success_top_traffic