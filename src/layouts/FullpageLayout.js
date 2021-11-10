import React from "react";
import themeConfig from "../configs/themeConfig";
import classnames from "classnames";
import { history } from "../history";

const FullPageLayout = ({ children, ...rest }) => {
  let pathName = history.location.pathname;
  return (
    <div
      className={classnames(
        "full-layout wrapper bg-full-screen-image blank-page dark-layout",
        {
          "layout-dark": themeConfig.layoutDark,
        }
      )}
    >
      <div className="app-content">
        <div className="content-wrapper">
          <div className="content-body">
            <div className={classnames(`flexbox-container ${(pathName.indexOf("/televisit") > -1 || pathName.indexOf("/video-chat") > -1) ? "video-flex" : ''}${pathName == "/doctor" || pathName == "/patient" ? "normal-view" : ''}${pathName == "/help" ? "help-view" : ''}`)}>
              <main className="main w-100">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPageLayout;
