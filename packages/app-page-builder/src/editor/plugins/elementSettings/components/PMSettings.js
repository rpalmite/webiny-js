//@flow
import React, { useMemo } from "react";
import { connect } from "@webiny/app-page-builder/editor/redux";
import { useHandler } from "@webiny/app/hooks/useHandler";
import { Tabs, Tab } from "@webiny/ui/Tabs";
import { get, isEqual } from "lodash";
import { set, merge } from "dot-prop-immutable";
import { updateElement } from "@webiny/app-page-builder/editor/actions";
import { getActiveElement } from "@webiny/app-page-builder/editor/selectors";
import { ReactComponent as BorderOuterIcon } from "@webiny/app-page-builder/editor/assets/icons/border_outer.svg";
import { ReactComponent as BorderLeftIcon } from "@webiny/app-page-builder/editor/assets/icons/border_left.svg";
import { ReactComponent as BorderRightIcon } from "@webiny/app-page-builder/editor/assets/icons/border_right.svg";
import { ReactComponent as BorderTopIcon } from "@webiny/app-page-builder/editor/assets/icons/border_top.svg";
import { ReactComponent as BorderBottomIcon } from "@webiny/app-page-builder/editor/assets/icons/border_bottom.svg";
import SliderWithInput from "./SliderWithInput";
import Footer from "./Footer";

/**
 * PMSettings (Padding/Margin settings).
 * This component is reused in Padding and Margin plugins since the behavior of both CSS attributes is the same.
 */

type Props = Object & {
    value: Object | number
};

const PMSettings = (props: Props) => {
    const { advanced, valueKey } = props;

    const updateSettings = useHandler(props, ({ element, updateElement }) => {
        return (name: string, newValue: mixed, history = false) => {
            const propName = `${valueKey}.${name}`;

            if (name !== "advanced") {
                newValue = parseInt(newValue) || 0;
            }

            let newElement = set(element, propName, newValue);

            // Update all values in advanced settings
            if (propName.endsWith(".all")) {
                const prefix = propName.includes("desktop") ? "desktop" : "mobile";
                newElement = merge(newElement, `${valueKey}.${prefix}`, {
                    top: newValue,
                    right: newValue,
                    bottom: newValue,
                    left: newValue
                });
            }

            updateElement({
                element: newElement,
                history,
                merge: true
            });
        };
    });

    const getUpdateValue = useMemo(() => {
        const handlers = {};
        return (name: string) => {
            if (!handlers[name]) {
                handlers[name] = value => updateSettings(name, value, true);
            }

            return handlers[name];
        };
    }, [updateSettings]);

    const getUpdatePreview = useMemo(() => {
        const handlers = {};
        return (name: string) => {
            if (!handlers[name]) {
                handlers[name] = value => updateSettings(name, value, false);
            }

            return handlers[name];
        };
    }, [updateSettings]);

    return (
        <Tabs>
            <Tab label={"Desktop"}>
                {!advanced ? (
                    <SliderWithInput
                        className={"no-bottom-padding"}
                        icon={<BorderOuterIcon />}
                        valueKey={valueKey + ".desktop.all"}
                        updateValue={getUpdateValue("desktop.all")}
                        updatePreview={getUpdatePreview("desktop.all")}
                    />
                ) : (
                    <React.Fragment>
                        <SliderWithInput
                            icon={<BorderTopIcon />}
                            valueKey={valueKey + ".desktop.top"}
                            updateValue={getUpdateValue("desktop.top")}
                            updatePreview={getUpdatePreview("desktop.top")}
                        />
                        <SliderWithInput
                            icon={<BorderRightIcon />}
                            valueKey={valueKey + ".desktop.right"}
                            updateValue={getUpdateValue("desktop.right")}
                            updatePreview={getUpdatePreview("desktop.right")}
                        />
                        <SliderWithInput
                            icon={<BorderBottomIcon />}
                            valueKey={valueKey + ".desktop.bottom"}
                            updateValue={getUpdateValue("desktop.bottom")}
                            updatePreview={getUpdatePreview("desktop.bottom")}
                        />
                        <SliderWithInput
                            className={"no-bottom-padding"}
                            icon={<BorderLeftIcon />}
                            valueKey={valueKey + ".desktop.left"}
                            updateValue={getUpdateValue("desktop.left")}
                            updatePreview={getUpdatePreview("desktop.left")}
                        />
                    </React.Fragment>
                )}
                <Footer advanced={Boolean(advanced)} toggleAdvanced={getUpdateValue("advanced")} />
            </Tab>
            <Tab label={"Mobile"}>
                {!advanced ? (
                    <SliderWithInput
                        className={"no-bottom-padding"}
                        icon={<BorderOuterIcon />}
                        valueKey={valueKey + ".mobile.all"}
                        updateValue={getUpdateValue("mobile.all")}
                        updatePreview={getUpdatePreview("mobile.all")}
                    />
                ) : (
                    <React.Fragment>
                        <SliderWithInput
                            icon={<BorderTopIcon />}
                            valueKey={valueKey + ".mobile.top"}
                            updateValue={getUpdateValue("mobile.top")}
                            updatePreview={getUpdatePreview("mobile.top")}
                        />
                        <SliderWithInput
                            icon={<BorderRightIcon />}
                            valueKey={valueKey + ".mobile.right"}
                            updateValue={getUpdateValue("mobile.right")}
                            updatePreview={getUpdatePreview("mobile.right")}
                        />
                        <SliderWithInput
                            icon={<BorderBottomIcon />}
                            valueKey={valueKey + ".mobile.bottom"}
                            updateValue={getUpdateValue("mobile.bottom")}
                            updatePreview={getUpdatePreview("mobile.bottom")}
                        />
                        <SliderWithInput
                            className={"no-bottom-padding"}
                            icon={<BorderLeftIcon />}
                            valueKey={valueKey + ".mobile.left"}
                            updateValue={getUpdateValue("mobile.left")}
                            updatePreview={getUpdatePreview("mobile.left")}
                        />
                    </React.Fragment>
                )}
                <Footer advanced={Boolean(advanced)} toggleAdvanced={getUpdateValue("advanced")} />
            </Tab>
        </Tabs>
    );
};

export default connect(
    (state, { styleAttribute }: Object) => {
        const valueKey = "data.settings." + styleAttribute;
        const element = getActiveElement(state);
        return {
            valueKey,
            advanced: get(element, valueKey + ".advanced", false),
            element: {
                id: element.id,
                type: element.type,
                path: element.path
            }
        };
    },
    { updateElement },
    null,
    {
        areStatePropsEqual: isEqual
    }
)(PMSettings);
