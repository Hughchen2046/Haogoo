import Logo from '../Tools/Logo';
import { IdCard, Phone, Mail, Map } from 'lucide-react';

export default function Footer() {
  return (
    <div className="bg-dark">
      <div className="container py-48 px-12">
        <Logo className="text-white mb-32 mb-md-40 footer-logo" />
        <ul className="d-flex flex-column flex-md-row gap-md-40 align-items-md-center mb-32 mb-md-40 text-white list-unstyled pb-32 pb-md-40 border-bottom border-gray-50">
          <li className="mb-24  mb-md-0">
            <a
              className="link-light text-decoration-none px-16 py-8 d-flex align-items-center gap-8"
              href=""
            >
              <IdCard />
              關於我們
            </a>
          </li>
          <li className="mb-24  mb-md-0">
            <a
              className="link-light text-decoration-none px-16 py-8 d-flex align-items-center gap-8"
              href=""
            >
              <Phone />
              打給我們
            </a>
          </li>
          <li className="mb-24  mb-md-0">
            <a
              className="link-light text-decoration-none px-16 py-8 d-flex align-items-center gap-8"
              href=""
            >
              <Mail />
              寫信給我們
            </a>
          </li>
          <li className=" px-16 d-flex align-items-center gap-8">
            {' '}
            <Map />
            100001 台北市中正區好股路1號1樓
          </li>
        </ul>
        <p className="caption text-gray-200">Copyright © 好股科技股份有限公司</p>
      </div>
    </div>
  );
}
