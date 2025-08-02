# Shopify App Store Submission Requirements

## 📋 Required Information

### App Listing Details
- [ ] App name and description
- [ ] App icon (512x512px)
- [ ] Screenshots (1280x800px, at least 3)
- [ ] App category selection
- [ ] Pricing information
- [ ] Support contact information

### Technical Requirements
- [ ] App must be fully functional
- [ ] Proper error handling
- [ ] GDPR compliance (privacy policy, data handling)
- [ ] Webhook endpoints for mandatory webhooks
- [ ] App uninstall cleanup

### Content Requirements
- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] Support documentation
- [ ] App description (detailed)
- [ ] Feature list
- [ ] Installation instructions

### Testing Requirements
- [ ] App works in test store
- [ ] All features functional
- [ ] No broken links or errors
- [ ] Proper user experience flow

## 🚨 Mandatory Webhooks
Your app MUST handle these webhooks:
- app/uninstalled
- customers/data_request
- customers/redact
- shop/redact