import * as filterRoles from 'public/Pages/Communication/Target-Audience/filters-roles.js'

export const TIME = {
    AUTO_SAVE: 2000,
}

export const FileNameLength = 22;

export const WixSmartConectCourseid = '8333';

export const SmartSecret = "SmartSecret";
export const QASecret = 'QASecret';

export const CommunicationDahboardStates = {
    ALL: 'All',
    SENT: 'Sent',
    DRAFT: 'Draft',
    ARCHIVE: 'Archive',
}

export const AllCompuseEmailTopBarButton = ['addDetailsButton', 'targetAudienceButton', 'createEmailButton', 'testAndSendButton'];

export const AllEditTemplateBarButton = ['addDetailsButton', 'createEmailButton', 'testAndSendButton'];

export const AllCommunicationDashboardRepeaterButtons = ['allButton', 'sentButton', 'draftsButton', 'archiveButton'];

export const AllAudienceRepeaterButtons = ['approvedUsersButton', 'needApprovalButton', 'rejectedUsersButton'];

export const AllMainDashboardButtons = ['myCommunicationsButton', 'myTemplatesButton'];

export const AllPreviewSectionsButtons = ['previewButton', 'detailsButton'];

export const AllLoginBottomButtons = ['analyzeAudienceButton', 'sendEmailsButton', 'getDeliverabilityButton', 'useOneToolButton'];

export const CommunicationActions = {
    All: ['#editCommunicationButton', '#reuseCommunicationButton', '#saveAsTempalteButton', '#archiveCommunicationButton', '#uarchiveCommunicationButton'],
    Sent: ['#reuseCommunicationButton', '#saveAsTempalteButton', '#archiveCommunicationButton'],
    Draft: ['#editCommunicationButton', '#saveAsTempalteButton', '#archiveCommunicationButton'],
    Archive: ['#reuseCommunicationButton', '#saveAsTempalteButton', '#uarchiveCommunicationButton'],
}

export const CommunicationStatesByOrder = [
    "AddDetailsState",
    "TargetAudienceState",
    "CreateEmailStep",
    "TestAndSendState",
]

export const Urls = {
    EXISTS_COMMUNICATION: '/communication/',
    MY_COMMUNICATIONS_DASHOBOARD: '/my-communications',
    PREVIEW: '/preview/',
}

export const Text = {
    NO_NAME: 'Temporary name',
    SENT_ON: 'Sent on: ',
    EDITED_ON: 'Last edited on: ',
    WILL_BE_SENT_TO: (num) => `This email will be sent to ${num || 0} users.`,
    SEND_POPUP_TITLE: (num) => `Send this communication to ${num || 0} users.`,
    APPROVE_ALL: 'SELECT ALL',
    UNAPPROVE_ALL: 'CLEAR ALL',
    REUSE_COMMUNICATION: 'Reuse as a New Communication',
    REUSE_TEMPLATE: 'Reuse Template',
    SEND: 'send',
    CANCEL: 'cancel',
    REQUEST_APPROVAL_BTN: (num) => `Request Approval ${num}`,
    NUM_OF_APPROVED: (num) => `${num} selected`,
    USERS_WERE_UPLOADED: (num) => `Done! ${num} users were added :)`,
    USERS_WERE_NOT_UPLOADED: (num) => `${num} users were not added to your target audience, please check your CSV is built according to the definitions`,
}

export const SmartRepeaterConsts = {
    DEFAULT_LIMIT: 10,
    START_LOAD_NEXT: 8,
    SKIP: 0,
}

export const LoginPageImages = {
    'analyzeAudience': 'wix:image://v1/35958b_ad94644f615c4bf28049e4a0417b2c82~mv2.png/LogIn%20Page%20Tab%2016.png#originWidth=1370&originHeight=1120',
    'sendEmails': 'wix:image://v1/35958b_d625e2841ddb4d28a8e36b7f94fc8c0b~mv2.png/LogIn%20Page%20Tab%2013.png#originWidth=1370&originHeight=1120',
    'getDeliverability': 'wix:image://v1/35958b_fc1b0aa0090e462089ce1cb582a38fb0~mv2.png/LogIn%20Page%20Tab%2014.png#originWidth=1370&originHeight=1120',
    'useOneToolButton': 'wix:image://v1/35958b_78e5a78a48a141d28a3af8271f6abbb8~mv2.png/LogIn%20Page%20Tab%2015.png#originWidth=1370&originHeight=1120'
}

export const DynamicFieldsOptions = {
    'BusinessName': 'Business_Name',
    'UserWebsiteURL': 'User_Website_URL',
    'UserFirstName': 'User_First_Name',
}

export const TemplatesTypes = {
    UserNameTemaplate: 'blast_marketing_templates_em-marketing-tool-template-2-privet-name_25122022_en',
    DefaultTempalte: 'blast_marketing_templates_em-marketing-tool-template-1_25122022_en',
}

export const AllVerticals = [{
    _id: '1',
    shouldDispaly: (user) => filterRoles.isTopUserByBlog(user),
    verticalTitle: 'blog',
    fields: ['blog_paid_post_gpv', 'blog_post_views']
},
{
    _id: '2',
    shouldDispaly: (user) => filterRoles.isTopUserByBookings(user),
    verticalTitle: 'bookings',
    fields: ['booking_online_gpv', 'booking_participants', 'booking_total_gpv', 'booking_mixed']
},
{
    _id: '3',
    shouldDispaly: (user) => filterRoles.isTopUserByEvents(user),
    verticalTitle: 'events',
    fields: ['events_top_gpv', 'events_top_rsvp'],
},
{
    _id: '4',
    shouldDispaly: (user) => filterRoles.isTopUserByForum(user),
    verticalTitle: 'forum',
    fields: ['forum_zscore']
},
{
    shouldDispaly: (user) => filterRoles.isTopUserByGroups(user),
    _id: '5',
    verticalTitle: 'groups',
    fields: ['groups_engagement']
},
{
    _id: '6',
    shouldDispaly: (user) => filterRoles.isTopUserByPayments(user),
    verticalTitle: 'payments',
    fields: ['payments_pbw_top_merchant_rank', 'payments_wp_top_merchant_rank']
},
{
    _id: '7',
    shouldDispaly: (user) => filterRoles.isTopUserByPromote(user),
    verticalTitle: 'promote',
    fields: ['promote_top_social_marketing']
},
{
    _id: '8',
    shouldDispaly: (user) => filterRoles.isTopUserByRestaurants(user),
    verticalTitle: 'restaurants',
    fields: ['restaurants_rank_by_7_days_online_gpv', 'restaurants_rank_by_30_days_online_gpv', 'restaurants_rank_by_90_days_online_gpv']
},
{
    _id: '9',
    shouldDispaly: (user) => filterRoles.isTopUserByStores(user),
    verticalTitle: 'stores',
    fields: ['stores_top_gpv']
},
{
    _id: '10',
    shouldDispaly: (user) => filterRoles.isTopUserByViewer(user),
    verticalTitle: 'viewer',
    fields: ['viewer_top_sessions']
},
{
    _id: '11',
    shouldDispaly: (user) => filterRoles.isTopUserByPricingPlans(user),
    verticalTitle: 'pricing_Plans',
    fields: ['pricing_plans_top_gpv']
},
{
    _id: '12',
    shouldDispaly: (user) => filterRoles.isTopUserBySiteSuccess(user),
    verticalTitle: 'site_success',
    fields: ['site_success_top_gpv', 'site_success_top_traffic']
},
{
    _id: '13',
    shouldDispaly: (user) => filterRoles.isTopUserByMobileApps(user),
    verticalTitle: 'mobile_apps',
    fields: ['mobile_apps_top_engagement', 'mobile_apps_top_traffic', 'mobile_apps_top_gpv']
},
]

export const Labels = {
    blog: 'Blog',
    blog_post_views: 'Post views',
    blog_paid_post_gpv: 'Paid Post GPV',

    bookings: 'Bookings',
    booking_mixed: 'mixed',
    booking_total_gpv: 'total GPV',
    booking_participants: 'participants',
    booking_online_gpv: 'online gpv',

    events: 'Events',
    events_top_rsvp: 'RSVP usage',
    events_top_gpv: 'GPV',

    forum: 'Forum',
    forum_zscore: 'Z score',

    groups: 'Groups',
    groups_engagement: 'Top engagement',

    payments: 'Payments',
    payments_wp_top_merchant_rank: 'wp top merchant rank',
    payments_pbw_top_merchant_rank: 'pbw top merchant rank',

    promote: 'Promote',
    promote_top_social_marketing: 'Top social marketing',

    restaurants: 'Restaurants',
    restaurants_rank_by_90_days_online_gpv: '90 days online GPV',
    restaurants_rank_by_30_days_online_gpv: '30 days online GPV',
    restaurants_rank_by_7_days_online_gpv: '7 days online GPV',

    stores: 'Stores',
    stores_top_gpv: 'Top GPV',

    viewer: 'Viewer',
    viewer_top_sessions: 'Top sessions',

    pricing_Plans: 'Pricing Plans',
    pricing_plans_top_gpv: 'Top GPV',

    site_success: 'Site Success',
    site_success_top_traffic: 'Top traffic',
    site_success_top_gpv: 'Top GPV',

    mobile_apps: 'Mobile Apps',
    mobile_apps_top_gpv: 'Top GPV',
    mobile_apps_top_traffic: 'Top traffic',
    mobile_apps_top_engagement: 'Top engagement',
}