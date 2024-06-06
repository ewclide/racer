declare namespace AppCssNamespace {
  export interface IAppCss {
    distance: string;
    money: string;
    "score-item": string;
    scores: string;
  }
}

declare const AppCssModule: AppCssNamespace.IAppCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AppCssNamespace.IAppCss;
};

export = AppCssModule;