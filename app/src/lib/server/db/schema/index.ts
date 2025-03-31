import { users } from './users';
import { sessions } from './sessions';
import { logs } from './logs';
import { pings } from './pings';
import { stocks } from './stocks';
import { companies } from './companies';
import { industries } from './industries';
import { sectors } from './sectors';

export type { User, NewUser } from './users';
export type { Session, NewSession } from './sessions';
export type { Log, NewLog } from './logs';
export type { Ping, NewPing } from './pings';
export type { Stock, NewStock } from './stocks';
export type { Company, NewCompany } from './companies';
export type { Industry, NewIndustry } from './industries';
export type { Sector, NewSector } from './sectors';

export const tables = {
	users,
	sessions,
	logs,
	pings,
	stocks,
	companies,
	industries,
	sectors
};
