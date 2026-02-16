export default function SellerSummaryCard({ summary }) {
  const formatted = summary
    .replace(/### (.*)/g, '<h3 class="text-lg font-bold mt-4">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*   (.*?)\n/g, "<li>$1</li>")
    .replace(/\n/g, "<br/>");

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-3">Seller Summary</h2>
      <div
        className="prose max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    </div>
  );
}
