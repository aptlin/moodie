/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "*.svg" {
  const content: string;
  export default content;
}
