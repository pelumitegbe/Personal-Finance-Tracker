export interface LayoutProps {
  name: string;
  pageTitle: string;
  children: JSX.Element[] | JSX.Element;
}

export interface ChildProps {
  children: JSX.Element[] | JSX.Element;
}

export interface userProps {
  _id: string;
  firstname: string;
  lastname: string;
  middlename: string;
  fullname: string;
  phone: string;
  email: string;
  role?: string;
  birthday?: string;
  gender?: string;
}

export interface IDecodedUser {
  email: string;
  exp: number;
  iat: number;
  jti?: string;
  phone: string;
  role: string;
  token_type?: string;
  _id: string;
  fullname?: string;
}

