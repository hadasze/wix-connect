export class Communication {
    constructor(_id, origin, replyToAddress, senderName) {
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
            fullName: senderName,
            jobTitle: null,
        }
        this.finalDetails = {
            senderName,
            subjectLine: null,
            previewText: null,
            replyToAddress,
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