import React from 'react';
import JsBarcode from 'jsbarcode';

export class Barcode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.barCode, //由父组件传入用来生成条形码的字符串“barCode”
        };
    }
    componentDidMount() {
        // 调用 JsBarcode方法生成条形码
        JsBarcode(this.barcode, this.state.value, {
            displayValue: false,
            width: 2,
            height: 50,
            margin: 0,
        });
    }

    render() {
        return (
            <div className="barcode-box">
                <svg
                    ref={(ref) => {
                        this.barcode = ref;
                    }}
                />
            </div>
        );
    }
}
export default Barcode;//导出组件