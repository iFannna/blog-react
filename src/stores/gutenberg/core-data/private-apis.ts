import { useEntityRecordsWithPermissions } from './hooks/use-entity-records';
import { RECEIVE_INTERMEDIATE_RESULTS } from './utils';
import { getTemplateInfo } from './utils/get-template-info';
import { getTemplatePartIcon } from './utils/get-template-part-icon';
import {
	EntitiesSavedStatesExtensible,
	default as EntitiesSavedStates,
} from './components/entities-saved-states';
import { useIsDirty as useEntitiesSavedStatesIsDirty } from './components/entities-saved-states/hooks/use-is-dirty';
import { PrivateEntityProvider } from './entity-provider';
import { lock } from './lock-unlock';

const lockedApis = {
	PrivateEntityProvider,
	EntitiesSavedStates,
	EntitiesSavedStatesExtensible,
	getTemplateInfo,
	getTemplatePartIcon,
	useEntitiesSavedStatesIsDirty,
	useEntityRecordsWithPermissions,
	RECEIVE_INTERMEDIATE_RESULTS,
};

export type CoreDataPrivateApis = typeof lockedApis;

export const privateApis = {};
lock( privateApis, lockedApis );
