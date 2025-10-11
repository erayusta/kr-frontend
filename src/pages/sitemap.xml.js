import apiRequest from "@/lib/apiRequest";
import serverApiRequest from "@/lib/serverApiRequest";

export default function SiteMap() {
  return null;
}

export async function getServerSideProps({ res }) {
 const response = await serverApiRequest('/generate-sitemap', 'get')
  res.setHeader('Content-Type', 'application/xml');
  res.write(response);
  res.end();

  return {
    props: {},
  };
}
