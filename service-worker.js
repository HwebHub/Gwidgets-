self.addEventListener("widgetinstall", e => e.waitUntil(renderWidget(e.widget)));
self.addEventListener("activate", e => e.waitUntil(updateWidgets()));
self.addEventListener("periodicsync", e => {
  if (e.tag) e.waitUntil(updateWidgetByTag(e.tag));
});

async function renderWidget(widget) {
  const tpl = await fetch(widget.definition.msAcTemplate).then(r => r.text());
  const data = await fetch(widget.definition.data).then(r => r.text());
  await self.widgets.updateByTag(widget.definition.tag, { template: tpl, data });
}

async function updateWidgets() {
  for (const w of await self.widgets.matchAll({})) {
    await renderWidget(w);
  }
}

async function updateWidgetByTag(tag) {
  const w = await self.widgets.getByTag(tag);
  if (w) await renderWidget(w);
}
