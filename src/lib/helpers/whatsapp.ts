export function buildWhatsAppLink(
  phone: string,
  message: string
): string {
  const cleaned = phone.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

export function buildListingWhatsAppMessage(opts: {
  listingTitle: string;
  listingId: string;
  agentName: string;
}): string {
  return `السلام عليكم ${opts.agentName}،\nأنا مهتم بالعقار: ${opts.listingTitle}\nرقم الإعلان: ${opts.listingId}\nأرجو التواصل معي.`;
}
