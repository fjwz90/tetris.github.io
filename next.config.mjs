const isProd = process.env.NODE_ENV === 'production';
const repoName = process.env.NEXT_PUBLIC_REPO_NAME || "";
export default {
  output: "export",
  images: { unoptimized: true },
  basePath: isProd && repoName ? `/${repoName}` : "",
  assetPrefix: isProd && repoName ? `/${repoName}/` : "",
  trailingSlash: true
};
