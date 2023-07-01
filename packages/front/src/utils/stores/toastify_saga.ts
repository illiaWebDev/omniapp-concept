import { all, takeLatest, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import type { ACreators } from '@illia-web-dev/types/dist/types/ACreators';
import type { RecordValues } from '@illia-web-dev/types/dist/types/RecordValues';


export const aTypes = {
  showToastRaw: 'toastify/show-toast-raw',
  showToast: 'toastify/show-toast',
} as const;
export type Actions = {
  showToastRaw: {
    type: typeof aTypes.showToastRaw;
    payload: Parameters< typeof toast >;
  };
  showToast: {
    type: typeof aTypes.showToast;
    payload: {
      text: string;
      type: NonNullable< NonNullable< Parameters< typeof toast >[ 1 ] >[ 'type' ] >;
    };
  };
};
export type AllActions = RecordValues< Actions >;


export const aCreators: ACreators< Actions > = {
  showToastRaw: p => ( { type: aTypes.showToastRaw, payload: p } ),
  showToast: p => ( { type: aTypes.showToast, payload: p } ),
};

// ===================================================================================


export function* saga() {
  yield all( [
    takeLatest( aTypes.showToastRaw, function* onToastRaw( a: Actions[ 'showToastRaw' ] ): Gen {
      yield toast( ...a.payload );
    } ),
    takeLatest( aTypes.showToast, function* onToast( { payload: { text, type } }: Actions[ 'showToast' ] ) {
      yield put( aCreators.showToastRaw( [
        text,
        {
          theme: 'colored',
          position: 'bottom-center',
          type,
        },
      ] ) );
    } ),
  ] );
}
