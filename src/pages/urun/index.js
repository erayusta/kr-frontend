export async function getServerSideProps() {
  return { redirect: { destination: '/fiyat-karsilastir', permanent: false } };
}

export default function UrunIndex() { return null; }
