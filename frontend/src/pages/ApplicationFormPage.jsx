import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

/* ─── layout helpers ─────────────────────────────────────────────────────── */
const SECTION = ({ title, children }) => (
  <div style={{ marginBottom: "2rem" }}>
    <h3 style={{
      fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: "1rem",
      color: "#f0a500", textTransform: "uppercase", letterSpacing: "2px",
      borderBottom: "1px solid rgba(240,165,0,0.2)", paddingBottom: "8px", marginBottom: "1.5rem",
    }}>{title}</h3>
    {children}
  </div>
);

const F2 = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.2rem" }}>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label>{label}</label>
    {children}
  </div>
);

/* ─── FileUploadBox ──────────────────────────────────────────────────────── */
/**
 * KEY FIX: Do NOT pass `headers: { "Content-Type": "multipart/form-data" }` manually.
 * When you set it manually, the multipart boundary is missing and the server can't parse
 * the request. Let axios (and the browser) set it automatically by omitting that header.
 */
function FileUploadBox({ label, hint, accept, fieldName, onUploaded, currentDataUri, API }) {
  const inputRef            = useRef(null);
  const [busy, setBusy]     = useState(false);
  const [preview, setPreview] = useState(currentDataUri || null);

  // Sync preview when parent passes a saved data-uri (e.g. from draft)
  useEffect(() => {
    if (currentDataUri) setPreview(currentDataUri);
  }, [currentDataUri]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large — maximum 5 MB");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("field_name", fieldName);

    setBusy(true);
    try {
      // ✅ NO manual Content-Type header — axios sets multipart/form-data + boundary automatically
      const res = await axios.post(`${API}/application/upload`, fd);

      const dataUri = res.data.data_uri;
      setPreview(dataUri);
      onUploaded(fieldName, dataUri, res.data.filename);
      toast.success("File uploaded successfully ✅");
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || "Upload failed";
      toast.error(`Upload failed: ${msg}`);
      console.error("[Upload]", err?.response || err);
    } finally {
      setBusy(false);
      // Reset the input so the same file can be re-selected if needed
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const isPdf   = preview && preview.startsWith("data:application/pdf");
  const isImage = preview && !isPdf;

  return (
    <div style={{
      border: `2px dashed ${preview ? "rgba(46,204,113,0.5)" : "rgba(240,165,0,0.3)"}`,
      borderRadius: "10px", padding: "1.2rem",
      background: preview ? "rgba(46,204,113,0.05)" : "rgba(13,27,42,0.4)",
      transition: "all 0.3s",
    }}>
      <label style={{ marginBottom: "0.4rem", display: "block" }}>{label}</label>
      {hint && <p style={{ color: "#8a9bb0", fontSize: "0.78rem", marginBottom: "0.8rem" }}>{hint}</p>}

      {/* Preview */}
      {preview && (
        <div style={{ marginBottom: "0.8rem", textAlign: "center" }}>
          {isImage ? (
            <img
              src={preview} alt="Uploaded preview"
              style={{
                maxHeight: 150, maxWidth: "100%",
                borderRadius: "8px", objectFit: "contain",
                border: "1px solid rgba(240,165,0,0.25)",
                background: "#fff", padding: "4px",
              }}
            />
          ) : (
            <div style={{
              padding: "0.8rem 1rem",
              background: "rgba(240,165,0,0.1)", border: "1px solid rgba(240,165,0,0.25)",
              borderRadius: "6px", color: "#f0a500", fontFamily: "Rajdhani", fontWeight: 600, fontSize: "0.9rem",
            }}>
              📄 PDF uploaded successfully
            </div>
          )}
        </div>
      )}

      {/* Button row */}
      <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          style={{
            padding: "9px 20px",
            background: preview ? "rgba(46,204,113,0.15)" : "rgba(240,165,0,0.12)",
            color: preview ? "#2ecc71" : "#f0a500",
            border: `1px solid ${preview ? "rgba(46,204,113,0.4)" : "rgba(240,165,0,0.35)"}`,
            borderRadius: "7px", cursor: busy ? "wait" : "pointer",
            fontFamily: "Rajdhani", fontWeight: 600, fontSize: "0.85rem",
            textTransform: "uppercase", letterSpacing: "0.5px",
            opacity: busy ? 0.65 : 1, transition: "all 0.2s",
          }}
        >
          {busy ? "Uploading…" : preview ? "🔄 Change File" : "📎 Choose File"}
        </button>

        {preview ? (
          <span style={{ color: "#2ecc71", fontSize: "0.82rem", fontWeight: 600 }}>✔ Uploaded</span>
        ) : (
          <span style={{ color: "#8a9bb0", fontSize: "0.78rem" }}>
            {accept.includes("pdf") ? "PNG / JPG / PDF — max 5 MB" : "PNG / JPG — max 5 MB"}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        style={{ display: "none" }}
      />
    </div>
  );
}

/* ─── Success popup ──────────────────────────────────────────────────────── */
function SuccessPopup({ onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f, #0d1b2a)",
        border: "2px solid #2ecc71", borderRadius: "16px",
        padding: "3rem 2.5rem", textAlign: "center",
        maxWidth: "480px", width: "100%",
        animation: "popIn 0.3s ease",
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
        <h2 style={{
          fontFamily: "Bebas Neue,sans-serif", fontSize: "2rem",
          color: "#2ecc71", letterSpacing: "2px", marginBottom: "0.75rem",
        }}>APPLICATION SUBMITTED</h2>
        <p style={{ color: "#b0c4de", lineHeight: 1.75, marginBottom: "0.75rem" }}>
          Your Quarter Allotment application has been successfully submitted to the DVC BTPS Housing Committee.
        </p>
        <p style={{ color: "#8a9bb0", fontSize: "0.88rem", marginBottom: "2rem" }}>
          📱 An SMS confirmation has been sent to your registered mobile number.
          Track your application status from the dashboard.
        </p>
        <button className="btn-primary" onClick={onClose} style={{ padding: "12px 36px" }}>
          Go to Dashboard →
        </button>
      </div>
      <style>{`@keyframes popIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function ApplicationFormPage() {
  const { user, API } = useAuth();
  const navigate      = useNavigate();
  const [form, setForm]           = useState({});
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ── Pre-fill + load draft ── */
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name:                    user.name                    || "",
        designation:             user.designation             || "",
        department:              user.department              || "",
        pay_scale:               user.pay_scale               || "",
        grade_pay:               user.grade_pay               || "",
        dvc_joining_date:        user.dvc_joining_date        || "",
        current_station_joining: user.current_station_joining || "",
        marital_status:          user.marital_status          || "Unmarried",
        mobile:                  user.mobile                  || "",
        email:                   user.email                   || "",
      }));
    }
    axios.get(`${API}/application/draft`)
      .then(r => {
        if (r.data && Object.keys(r.data).length > 0) {
          setForm(prev => ({ ...prev, ...r.data }));
          toast("Draft loaded — continue where you left off.", { icon: "💾" });
        }
      })
      .catch(() => {});
  }, [user, API]); // eslint-disable-line

  const set = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileUploaded = (fieldName, dataUri, filename) => {
    setForm(prev => ({
      ...prev,
      [fieldName]: dataUri,
      [`${fieldName}_filename`]: filename,
    }));
  };

  const inputProps = (name, readOnly = false) => ({
    className: "input-field",
    name,
    value: form[name] || "",
    onChange: readOnly ? undefined : set,
    readOnly,
    style: readOnly ? { opacity: 0.7, cursor: "not-allowed" } : {},
  });

  const saveDraft = async () => {
    try {
      await axios.post(`${API}/application/save`, form);
      toast.success("Draft saved 💾");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Save failed");
    }
  };

  const submitForm = async () => {
    if (form.sc_st_category === "Yes" && !form.sc_st_certificate) {
      toast.error("Please upload your SC/ST certificate.");
      return;
    }
    if (!form.signature) {
      toast.error("Please upload your signature.");
      return;
    }
    if (!form.undertaking_accepted) {
      toast.error("Please accept the undertaking.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/application/submit`, form);
      setSubmitted(true);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  /* ── canSubmit ── */
  const canSubmit =
    !!form.undertaking_accepted &&
    !!form.signature &&
    !(form.sc_st_category === "Yes" && !form.sc_st_certificate) &&
    !loading;

  /* ══════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a" }}>
      <Navbar />
      {submitted && <SuccessPopup onClose={() => navigate("/dashboard")} />}

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 2rem 3rem" }}>

        {/* header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "0.75rem", color: "#f0a500", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Damodar Valley Corporation · Bokaro Thermal Power Station
          </div>
          <h1 style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: "2.5rem", letterSpacing: "3px", color: "#f8f9fa" }}>
            APPLICATION FOR <span style={{ color: "#f0a500" }}>FAMILY ACCOMMODATION</span>
          </h1>
          <div style={{ height: "2px", background: "linear-gradient(90deg,transparent,#f0a500,transparent)", margin: "1rem auto", maxWidth: "400px" }} />
          <p style={{ color: "#8a9bb0", fontSize: "0.85rem" }}>Ref. to Notification No. BKOD/ES/19(Notice)/-</p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "0.75rem",
            background: "rgba(240,165,0,0.1)", border: "1px solid rgba(240,165,0,0.3)",
            borderRadius: "6px", padding: "6px 16px", fontSize: "0.8rem", color: "#f0a500",
          }}>
            💾 Your progress is auto-saved as draft
          </div>
        </div>

        <div className="card" style={{ padding: "2.5rem" }}>

          {/* ── 1. Employee Info (pre-filled, read-only) ── */}
          <SECTION title="1. Employee Information (Auto-Filled from Records)">
            <F2>
              <Field label="Name of Employee"><input {...inputProps("name", true)} /></Field>
              <Field label="Department / Office"><input {...inputProps("department", true)} /></Field>
            </F2>
            <F2>
              <Field label="Designation"><input {...inputProps("designation", true)} /></Field>
              <Field label="Pay Scale"><input {...inputProps("pay_scale", true)} /></Field>
            </F2>
            <F2>
              <Field label="Grade Pay"><input {...inputProps("grade_pay", true)} /></Field>
              <Field label="I.C. No. / P.P.S.I."><input {...inputProps("ic_no")} placeholder="If applicable" /></Field>
            </F2>
          </SECTION>

          {/* ── 2. Pay Comprises ── */}
          <SECTION title="2. Pay Comprises">
            <F2>
              <Field label="Basic Pay / Mool Vetan"><input {...inputProps("basic_pay")} placeholder="₹ Amount" /></Field>
              <Field label="Grade Pay / Gred-Pay"><input {...inputProps("grade_pay_amount")} placeholder="₹ Amount" /></Field>
            </F2>
            <F2>
              <Field label="Special Pay / Vishesh Vetan"><input {...inputProps("special_pay")} placeholder="₹ Amount if any" /></Field>
              <Field label="Technical Pay / Takneeki Vetan"><input {...inputProps("technical_pay")} placeholder="₹ Amount if any" /></Field>
            </F2>
            <F2>
              <Field label="Deputation (Duty) Allowance"><input {...inputProps("deputation_allowance")} placeholder="₹ Amount if any" /></Field>
              <Field label="Non-Practise Allowance"><input {...inputProps("non_practise_allowance")} placeholder="₹ Amount if any" /></Field>
            </F2>
          </SECTION>

          {/* ── 3. Service Details ── */}
          <SECTION title="3. Service Details">
            <F2>
              <Field label="Date of Entering in DVC"><input {...inputProps("dvc_joining_date", true)} type="date" /></Field>
              <Field label="Date of Present Joining at Station"><input {...inputProps("current_station_joining", true)} type="date" /></Field>
            </F2>
            <F2>
              <Field label="Date of Entry into Slab"><input {...inputProps("entry_to_slab_date")} type="date" /></Field>
              <Field label="Is Service Continuous?">
                <select className="input-field" name="service_continuous" value={form.service_continuous || ""} onChange={set}>
                  <option value="">Select</option>
                  <option value="Yes">Yes (हाँ)</option>
                  <option value="No">No — Please provide particulars</option>
                </select>
              </Field>
            </F2>
            {form.service_continuous === "No" && (
              <Field label="Service Break Particulars">
                <input {...inputProps("service_break_details")} placeholder="Provide details of service break" />
              </Field>
            )}
          </SECTION>

          {/* ── 4. Personal Details ── */}
          <SECTION title="4. Personal Details">
            <F2>
              <Field label="Married / Unmarried">
                <select className="input-field" name="marital_status" value={form.marital_status || "Unmarried"} onChange={set}>
                  <option>Married</option>
                  <option>Unmarried</option>
                </select>
              </Field>
              <Field label="Mobile Number"><input {...inputProps("mobile")} placeholder="10-digit number" /></Field>
            </F2>
            <F2>
              <Field label="Email Address"><input {...inputProps("email")} type="email" placeholder="For notification" /></Field>
              <Field label="Date of Birth (Janam Tithi)"><input {...inputProps("date_of_birth")} type="date" /></Field>
            </F2>
          </SECTION>

          {/* ── 5. Quarter Details ── */}
          <SECTION title="5. Quarter / Accommodation Details">
            <F2>
              <Field label="Current Quarter No. (if any)">
                <input {...inputProps("current_quarter")} placeholder="Qtr. No. if presently allotted" />
              </Field>
              <Field label="Preference of Specific Quarter (if any)">
                <input {...inputProps("preferred_quarter")} placeholder="e.g. Block B, Type-B" />
              </Field>
            </F2>
            <Field label="Family accommodation at old station or HRA enjoyed?">
              <select className="input-field" name="old_station_accommodation" value={form.old_station_accommodation || ""} onChange={set}>
                <option value="">Select</option>
                <option value="Had family accommodation">Had family accommodation at old station</option>
                <option value="Was enjoying HRA">Was enjoying House Rent Allowance</option>
                <option value="Neither">Neither</option>
              </select>
            </Field>
            <div style={{ marginTop: "1.2rem" }}>
              <Field label="Willing to take any entitled quarter out of lot against this notification?">
                <select className="input-field" name="willing_any_quarter" value={form.willing_any_quarter || ""} onChange={set}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No — only as per preference</option>
                </select>
              </Field>
            </div>
          </SECTION>

          {/* ── 6. Category & SC/ST ── */}
          <SECTION title="6. Category & Other Details">
            <F2>
              <Field label="Whether wife/husband (both) working at BTPS?">
                <select className="input-field" name="spouse_working_btps" value={form.spouse_working_btps || ""} onChange={set}>
                  <option value="">Select</option>
                  <option value="Yes">Yes — quarters allotted to him/her</option>
                  <option value="No">No</option>
                  <option value="NA">Not Applicable</option>
                </select>
              </Field>

              {/* ✅ SC/ST: Yes / No only */}
              <Field label="Do you belong to SC/ST Category?">
                <select
                  className="input-field"
                  name="sc_st_category"
                  value={form.sc_st_category || ""}
                  onChange={e => {
                    const val = e.target.value;
                    setForm(prev => ({
                      ...prev,
                      sc_st_category: val,
                      // Clear certificate if switching to No
                      ...(val === "No" ? { sc_st_certificate: "", sc_st_certificate_filename: "" } : {}),
                    }));
                  }}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </Field>
            </F2>

            {/* ✅ Document upload — only when Yes selected */}
            {form.sc_st_category === "Yes" && (
              <div style={{ marginTop: "0.5rem" }}>
                <FileUploadBox
                  label="Upload SC/ST Certificate / Documentary Proof *"
                  hint="Upload a scanned copy of your caste certificate. Accepted formats: PNG, JPG, PDF — max 5 MB."
                  accept=".png,.jpg,.jpeg,.pdf"
                  fieldName="sc_st_certificate"
                  onUploaded={handleFileUploaded}
                  currentDataUri={form.sc_st_certificate || null}
                  API={API}
                />
                {!form.sc_st_certificate && (
                  <p style={{ color: "#f39c12", fontSize: "0.78rem", marginTop: "6px" }}>
                    ⚠ Certificate upload is required for SC/ST applicants before submitting.
                  </p>
                )}
              </div>
            )}
          </SECTION>

          {/* ── 7. Signature Upload ── */}
          <SECTION title="7. Signature of Employee">
            <p style={{ color: "#8a9bb0", fontSize: "0.88rem", marginBottom: "1rem", lineHeight: 1.65 }}>
              Sign your name on a clean white paper, take a clear photo or scan it, then upload below.
              This serves as your digital signature on the application.
            </p>
            <FileUploadBox
              label="Upload Signature *"
              hint="PNG or JPG only — max 5 MB. Make sure the signature is clearly visible on white background."
              accept=".png,.jpg,.jpeg"
              fieldName="signature"
              onUploaded={handleFileUploaded}
              currentDataUri={form.signature || null}
              API={API}
            />
            {!form.signature && (
              <p style={{ color: "#f39c12", fontSize: "0.78rem", marginTop: "6px" }}>
                ⚠ Signature upload is mandatory before submitting.
              </p>
            )}
          </SECTION>

          {/* ── 8. Undertaking ── */}
          <SECTION title="8. Undertaking / Sweekarti">
            <div style={{
              background: "rgba(240,165,0,0.05)", border: "1px solid rgba(240,165,0,0.15)",
              borderRadius: "8px", padding: "1.5rem", marginBottom: "1.2rem",
            }}>
              <p style={{ color: "#b0c4de", fontSize: "0.9rem", lineHeight: 1.85 }}>
                I certify that the above particulars are correct to the best of my knowledge and belief.
                I give an undertaking that:<br />
                (a) I shall use the quarters if allotted to me for normal residential purpose only.<br />
                (b) In case I fail to take occupation of quarters as per preference given by me, if the same is allotted,
                I shall forfeit my claim for consideration of any quarters for one year.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <input
                type="checkbox" id="undertaking"
                checked={!!form.undertaking_accepted}
                onChange={e => setForm(prev => ({ ...prev, undertaking_accepted: e.target.checked }))}
                style={{ marginTop: "3px", width: 18, height: 18, accentColor: "#f0a500", flexShrink: 0 }}
              />
              <label htmlFor="undertaking" style={{ textTransform: "none", fontSize: "0.9rem", color: "#b0c4de", letterSpacing: 0, cursor: "pointer" }}>
                I have read and agree to the above undertaking. I confirm all information provided is accurate.
              </label>
            </div>
          </SECTION>

          {/* ── Submission Checklist ── */}
          <div style={{
            background: "rgba(13,27,42,0.5)", border: "1px solid rgba(240,165,0,0.12)",
            borderRadius: "10px", padding: "1.2rem 1.5rem", marginBottom: "1.5rem",
          }}>
            <p style={{ fontFamily: "Rajdhani", fontWeight: 700, color: "#f0a500", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.75rem" }}>
              Submission Checklist
            </p>
            {[
              {
                label:     "SC/ST Certificate",
                done:      form.sc_st_category !== "Yes" || !!form.sc_st_certificate,
                skip:      !form.sc_st_category || form.sc_st_category === "No",
                skipLabel: "Not applicable",
              },
              { label: "Signature uploaded",  done: !!form.signature },
              { label: "Undertaking accepted", done: !!form.undertaking_accepted },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                <span style={{ fontSize: "1rem" }}>
                  {item.skip ? "⬜" : item.done ? "✅" : "❌"}
                </span>
                <span style={{ fontSize: "0.85rem", color: item.skip ? "#8a9bb0" : item.done ? "#2ecc71" : "#e74c3c" }}>
                  {item.label}{item.skip ? ` (${item.skipLabel})` : ""}
                </span>
              </div>
            ))}
          </div>

          {/* ── Action Buttons ── */}
          <div style={{
            display: "flex", gap: "1rem", justifyContent: "flex-end", flexWrap: "wrap",
            paddingTop: "1.5rem", borderTop: "1px solid rgba(240,165,0,0.15)",
          }}>
            <button className="btn-secondary" type="button" onClick={saveDraft} style={{ minWidth: "140px" }}>
              💾 Save Draft
            </button>
            <button
              className="btn-primary"
              type="button"
              disabled={!canSubmit}
              onClick={submitForm}
              style={{ minWidth: "190px", opacity: canSubmit ? 1 : 0.45 }}
            >
              {loading ? "Submitting…" : "✅ Submit Application"}
            </button>
          </div>
          {!canSubmit && !loading && (
            <p style={{ color: "#f39c12", fontSize: "0.78rem", textAlign: "right", marginTop: "0.5rem" }}>
              ⚠ Complete checklist above to enable submission
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
