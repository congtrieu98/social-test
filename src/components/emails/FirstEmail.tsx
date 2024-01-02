// import { Report } from "@/lib/db/schema/reports";
import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  // report: Report
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    {/* <h1>Welcome, {report.assignedTo}!</h1>
    <h1>Welcome, {report.jobCompleted}!</h1>
    <h1>Welcome, {report.jobUnfinished}!</h1>
    <h1>Welcome, {report.jobCompletedPrecent}!</h1>
    <h1>Welcome, {report.jobUnfinishedPercent}!</h1> */}

    <p>
      Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim
      labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet.
      Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum
    </p>
    <hr />
    <p>Sent with help from Resend and Kirimase 😊</p>
  </div>
);
