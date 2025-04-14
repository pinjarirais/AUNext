export default function ChangePinLayout({ children }) {
    return (
      <div className="form-wrap">
        <div className="login-form w-full p-4 pb-16">
          <div className="form-wrapp mx-auto sm:w-full sm:max-w-sm">
            {children}
          </div>
        </div>
      </div>
    );
  }
  