import { useRouter } from 'next/router';
import JsonGallery from '../../../components/products/JsonGallery';

const JsonGalleryPage = () => {
  const router = useRouter();
  const { filename } = router.query;

  return <JsonGallery filename={filename} />;
};

export default JsonGalleryPage;
