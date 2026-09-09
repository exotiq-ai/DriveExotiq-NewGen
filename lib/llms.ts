const SITE = "https://driveexotiq.com";

export function buildLlmsText(preview: boolean, formPreview = preview): string {
  const formStatus = formPreview
    ? "Preview forms validate entries but do not save information or send messages."
    : "Live forms save driving-community applications, marketplace waitlist requests, and partnership inquiries before reporting success.";

  return `# Drive Exotiq

> Good cars. Better company. A driving community and the front door to the upcoming exotiq.rent marketplace.

${preview ? "This is an unindexed design preview. " : ""}${formStatus} Rentals are not available to book here.

Drive Exotiq brings together owners and enthusiasts for small sunrise drives and Cars & Coffee. The proposed rhythm is the last Sunday of the month; confirmed dates, routes, and meet points are shared through invitations. The Denver-to-Miami journey is complete. Its roadbook uses verified endpoints and captioned archive photographs. Brand and event partnership inquiries have their own form.

## Public pages

- [Home](${SITE}/): the driving community and its current invitation
- [The drives](${SITE}/drives): invitation process and frequently asked questions
- [The roadbook](${SITE}/tour): completed journey and driving archive
- [The garage](${SITE}/marketplace): preview of the upcoming exotiq.rent marketplace
- [The journal](${SITE}/blog): original stories from the road
- [Request a drive invitation](${SITE}/apply?interest=drives): driving-community application
- [Partnerships](${SITE}/sponsor): brand and event partnership inquiries
`;
}
