// Type definitions for micro-template
// Project: https://github.com/cho45/micro-template.js
// Definitions by: Dmitry Gashko <https://github.com/DimaGashko>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare namespace MicroTemplate {
   interface MicroTemplateStatic {
      template: TemplateStatic,
      extended: ExtendedStatic
   }

   interface TemplateStatic {
      (id: string, data: any): any;
   }

   interface ExtendedStatic {
      (id: string, data: any): any;
   }

}

declare const microTemplate: MicroTemplate.MicroTemplateStatic

declare module "micro-template" {
   export = microTemplate
}