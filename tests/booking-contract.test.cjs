const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { runInNewContext } = require("node:vm");
const { resolve } = require("node:path");

const html = readFileSync(resolve(__dirname, "../index.html"), "utf8");
const start = html.lastIndexOf("// ==================== BOOKING FORM");
const stop = html.indexOf("</script>", start);
assert.ok(start > 0 && stop > start, "Missing actual booking handler");
const handler = html.slice(start, stop);

function runSubmit(overrides = {}) {
  const values = {
    "#booking-name": "Lucas",
    "#booking-email": "example@example.org",
    "#booking-project": "Mixagem",
    "#booking-message": "Olá, quero fazer um orçamento.",
    "#booking-budget": "R$ 500",
    ...overrides,
  };
  const fields = Object.fromEntries(Object.entries(values).map(([id,value]) => [
    id, { value, style: {}, parentElement: { appendChild: () => {} } }
  ]));
  const submitted = { handler: null, links: [], clicks: 0 };
  const form = {
    style: { display: "block" },
    querySelector: (sel) => fields[sel],
    querySelectorAll: () => [],
    getAttribute: (name) => name === "action" ? "mailto:duck-beats@hotmail.com" : null,
    addEventListener: (name, fn) => {
      assert.equal(name,"submit");
      submitted.handler = fn;
    }
  };
  const success = { style: { display: "none" } };
  const document = {
    getElementById: (id) => id === "bookingForm" ? form : id === "bookingSuccess" ? success : null,
    createElement: (tag) => {
      if (tag === "p") return { style: {}, textContent: "", className: "" };
      assert.equal(tag,"a");
      return { style: {}, href: "", click: () => { submitted.clicks++; }, remove: () => {} };
    },
    body: { appendChild: (node) => submitted.links.push(node) },
  };
  runInNewContext(handler, { document, encodeURIComponent,
    console: { log: () => { throw new Error("Never log personal booking data"); } }
  }, {timeout: 700});
  assert.equal(typeof submitted.handler, "function");
  submitted.handler({ preventDefault: () => {} });
  return { submitted, form, success, fields };
}

test("booking never claims email was sent by a website with no sending backend", () => {
  assert.doesNotMatch(html,/✓ Mensagem enviada com sucesso! Retornarei em breve/);
  assert.match(html,/Rascunho de email preparado/);
  assert.match(html,/<div id="bookingSuccess" role="status" aria-live="polite"/);
});
test("a valid request only opens the visitor mail-app draft, preserving form", () => {
  const {submitted,form,success} = runSubmit();
  assert.equal(submitted.clicks,1);
  assert.equal(success.style.display,"block");
  assert.equal(form.style.display,"block");
  assert.match(submitted.links[0].href,/^mailto:duck-beats@hotmail\.com\?subject=Booking%3A/);
  assert.match(submitted.links[0].href,/Nome%3A%20Lucas/);
});
test("invalid booking data cannot trigger an email draft", () => {
  for(const invalid of [
    {"#booking-name":" "},
    {"#booking-email":"invalid"},
    {"#booking-project":""},
  ]) {
    const {submitted,success} = runSubmit(invalid);
    assert.equal(submitted.clicks,0);
    assert.equal(success.style.display,"none");
  }
});

test("a failed resubmission clears the prior draft status without opening another draft", () => {
  const { submitted, success, fields } = runSubmit();
  assert.equal(success.style.display, "block");
  fields["#booking-name"].value = " ";
  submitted.handler({ preventDefault: () => {} });
  assert.equal(success.style.display, "none");
  assert.equal(submitted.clicks, 1);
});
