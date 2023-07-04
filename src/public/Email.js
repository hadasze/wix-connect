export class Email {
    constructor({
                    templateName,
                    senderName,
                    replyTo,
                    subjectLine,
                    previewText,
                    title,
                    emailContent,
                    emailcontent2,
                    firstLastName,
                    positionTitle,
                    communicationId
                }) {
        this.templateName = this.isValid('templateName', templateName);
        this.senderName = this.isValid('senderName', senderName);
        this.replyTo = this.isValid('replyTo', replyTo);
        this.subjectLine = this.isValid('subjectLine', subjectLine);
        this.previewText = previewText;
        this.title = title;
        this.emailContent = this.isValid('emailContent', emailContent);
        this.emailcontent2 = emailcontent2;
        this.firstLastName = firstLastName;
        this.positionTitle = positionTitle;
        this.communicationId = this.isValid('communicationId', communicationId);
    }

    isValid(name, arg) {
        if (!arg)
            throw new Error(name + ' is missing');
        return arg
    }

    createBody() {
        let params = {
            'senderName': this.senderName,
            'replyTo': this.replyTo,
            'subjectLine': this.subjectLine,
            'title': this.title,
            'emailContent': this.emailContent,
            'emailcontent2': this.emailcontent2,
            'firstLastName': this.firstLastName,
            'positionTitle': this.positionTitle,
            'communicationId': this.communicationId
        };
        if (this.previewText) {
            params['preheader'] = this.previewText
        }
        let body = {
            'template': {
                'name': this.templateName,
                'params': params,
                'nonHashParams': [
                    'replyTo',
                    'senderName',
                    'subjectLine',
                    'firstLastName',
                    'emailcontent2',
                    'positionTitle',
                    'title',
                    'communicationId'
                ]
            }
        }
        return body;
    }
}