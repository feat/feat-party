import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { languageLevel as languageLevelMessages } from '@/modules/user/messages';

import Button from '@feat/feat-ui/lib/button';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import { Row, Col } from '@feat/feat-ui/lib/grid';
import Popover from '@feat/feat-ui/lib/popover';

import CrossButton from '@/components/CrossButton';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import LanguageSelectPanel from '@/modules/language/components/LanguageSelectPanel';

function LevelLanguageWidget(props) {
  const { 
    field: {
      value,
      name,
    },
    form: { setFieldValue },
    locales, 
    selectedLocales, 
    fetchLocales, 
    recordLimit, 
  } = props;
  const popRef = useRef(null);
  
  return (
    <FormItem
      label={<FormLabel>
        <TranslatableMessage message={languageLevelMessages[name]} />
      </FormLabel>}
      modifier="dashed"
      className="ft-FormItem_inline"
    >
      {({ handleFocus, handleBlur }) => (
        <Row flex wrap>
          {value.map((language, i) => (
            <Col key={language.locale}>
              <CrossButton
                style={{ marginRight: 3, marginBottom: 3 }}
                onClick={() => {
                  const updated = [
                    ...value.slice(0, i),
                    ...value.slice(i+1),
                  ]
                  setFieldValue(name, updated);
                }}
              >
                {language.name}
              </CrossButton>
            </Col>
          ))}
          {(!recordLimit || value.length < recordLimit) && (
            <Col style={{ marginLeft: 'auto' }}>
              <Popover
                ref={popRef}
                wrapWithDefaultLayer={false}
                content={
                  <LanguageSelectPanel
                    fetchLocales={fetchLocales}
                    locales={locales}
                    canCreateLocale={false}
                    onConfirm={(locale, option) => {
                      const updated = [
                        ...value,
                        {
                          level: name,
                          locale: option.locale,
                          name: option.label,
                        },
                      ]
                      setFieldValue(name, updated)
                      handleBlur();
                      popRef.current && popRef.current.closePortal();
                    }}
                    shouldDisable={(option) => selectedLocales.indexOf(option.locale) > -1}
                  />
                }
                onOpen={handleFocus}
                onClose={handleBlur}
                stopPropagation={false}
              >
                <Button>+</Button>
              </Popover>
            </Col>
          )}
        </Row>
      )} 
    </FormItem>
  )
}

LevelLanguageWidget.propTypes = {
  field: PropTypes.object,
  form: PropTypes.object,
  locales: PropTypes.array,
  selectedLocales: PropTypes.array,
  fetchLocales: PropTypes.func,
  recordLimit: PropTypes.number,
}

export default LevelLanguageWidget;