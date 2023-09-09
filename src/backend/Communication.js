export class Communication {
    constructor(_id, origin) {
        this._id = _id;
        this.origin = origin;
        this.name = null;
        this.description = null;
        this.targetAudienceCsv = null;
        this.targetAudienceCsvFileName = null;
        this.targetAudience = null;
        this.manuallyApprovedUsers = [];
        this.template = {
            type: null,
            data: {
                img: null,
                title: '',
                body: null
            }
        };
        this.signature = {
            finalGreeting: 'Best regards,',
            fullName: null,
            jobTitle: null,
        }
        this.finalDetails = {
            senderName: null,
            subjectLine: null,
            previewText: null,
            replyToAddress: null,
        };
        this.dynamicVaribels = {
            businessName: null,
            userFirstName: null,
            userWebsiteUrl: null,
        };
        this.tested = null;
        this.sent = null;
        this.draft = null;
        this.archive = null;
        this.isTemplate = null;
        this.sentToCounter = null;
    }
}