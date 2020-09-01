import { useRef, useEffect, useCallback } from 'react'
// import { initCache } from '@/services/cache'

export function useTimeout(callback, deps, timeout) {
  const submitTimer = useRef(null);
  useEffect(() => {
    clearTimeout(submitTimer.current);
    submitTimer.current = setTimeout(callback, timeout);
  }, deps);
  return submitTimer.current;
}

export function useAutoSubmit(formProps, timeout) {
  const callback = useCallback(() => {
    if (formProps.dirty && formProps.isValid && !formProps.isSubmitting) {
      formProps.submitForm();
    }
  }, [formProps.values, formProps.isSubmitting]);
  return useTimeout(callback, [formProps.values], timeout);
}

// export function useCache(formProps, cacheOptions) {
//   const cache = useMemo(() => initCache({
//     cacheOptions,
//   }), [
//     cacheOptions.cacheKey,
//   ])
//   useEffect(() => {
//     if (cache.get('formValues')) {
//       formProps.setValues(cache.get('formValues'));
//     }
//   }, []);
//   cache.put(formProps.dirty ? formProps.values : null);
// }