import ButtonOutline from '../Tools/ButtonOutline';

export default function Header() {
  return (
    <>
      {' '}
      <div className="indexBackImg d-flex align-items-end align-items-md-center pb-48 pb-md-0">
        <div className="container font-zh-tw">
          <div className="row">
            <div className="col-12 d-flex flex-column align-items-center align-items-md-end">
              <div className="display-2 display-1-md text-white">一天一好股</div>
              <div className="display-2 display-1-md text-white mb-24 mb-md-32">
                Life is so good
              </div>
              <h6 className="text-gray-200 h5-md mb-24 mb-md-32">
                不再讓投資成為生活的另一個壓力來源
              </h6>
              <ButtonOutline type="button" className="w-auto h6 py-10 py-md-12 px-16 px-md-40">
                建立我的好股
              </ButtonOutline>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
