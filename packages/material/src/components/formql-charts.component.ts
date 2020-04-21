import { Component, OnInit, Input, forwardRef, Renderer2 } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormComponent } from '@formql/core';
import echarts from 'echarts';

@Component({
    selector: 'formql-charts',
    styles: [],
    template: `<div id="formql-charts" echarts [options]="chartsOptions" [theme]="Customed"
    class="{{field.className}}"></div>`,
    // template: `<div id="formql-charts" class="{{field.className}}"></div>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormQLChartsComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FormQLChartsComponent),
            multi: true
        }
    ]
})

export class FormQLChartsComponent implements OnInit, ControlValueAccessor {

    static componentName = 'FormQLChartsComponent';
    static formQLComponent = true;
    static validators = [];
    public chartsOptions = {};
    // public customed = {
    //     "color": [
    //         "#c23531",
    //         "#2f4554",
    //         "#61a0a8",
    //         "#d48265",
    //         "#91c7ae",
    //         "#749f83",
    //         "#ca8622",
    //         "#bda29a",
    //         "#6e7074",
    //         "#546570",
    //         "#c4ccd3"
    //     ],
    //     "backgroundColor": "rgba(0, 0, 0, 0)",
    //     "textStyle": {},
    //     "title": {
    //         "textStyle": {
    //             "color": "#333"
    //         },
    //         "subtextStyle": {
    //             "color": "#aaa"
    //         }
    //     },
    //     "line": {
    //         "itemStyle": {
    //             "normal": {
    //                 "borderWidth": 1
    //             }
    //         },
    //         "lineStyle": {
    //             "normal": {
    //                 "width": 2
    //             }
    //         },
    //         "symbolSize": 4,
    //         "symbol": "emptyCircle",
    //         "smooth": false,
    //         "color": "#000"
    //     },
    //     "radar": {
    //         "itemStyle": {
    //             "normal": {
    //                 "borderWidth": 1
    //             }
    //         },
    //         "lineStyle": {
    //             "normal": {
    //                 "width": 2
    //             }
    //         },
    //         "symbolSize": 4,
    //         "symbol": "emptyCircle",
    //         "smooth": false
    //     },
    //     "bar": {
    //         "itemStyle": {
    //             "normal": {
    //                 "barBorderWidth": 0,
    //                 "barBorderColor": "#000"
    //             },
    //             "emphasis": {
    //                 "barBorderWidth": 0,
    //                 "barBorderColor": "#000"
    //             }
    //         },
    //         "color": "#000"
    //     },
    //     "pie": {
    //         "itemStyle": {
    //             "normal": {
    //                 "borderWidth": 0,
    //                 "borderColor": "#ccc"
    //             },
    //             "emphasis": {
    //                 "borderWidth": 0,
    //                 "borderColor": "#ccc"
    //             }
    //         }
    //     },
    //     "scatter": {
    //         "itemStyle": {
    //             "normal": {
    //                 "borderWidth": 0,
    //                 "borderColor": "#ccc"
    //             },
    //             "emphasis": {
    //                 "borderWidth": 0,
    //                 "borderColor": "#ccc"
    //             }
    //         }
    //     },
    //     "boxplot": {
    //         "itemStyle": {
    //             "normal": {
    //                 "borderWidth": 0,
    //                 "borderColor": "#ccc"
    //             },
    //             "emphasis": {
    //                 "borderWidth": 0,
    //                 "borderColor": "#ccc"
    //             }
    //         }
    //     },
    //     "parallel": {
    //         "itemStyle": {
    //             "normal": {
    //                 "borderWidth": 0,
    //                 "borderColor": "#ccc"
    //             },
    //             "emphasis": {
    //                 "borderWidth": 0,
    //                 "borderColor": "#ccc"
    //             }
    //         }
    //     },
    //     "sankey": {
    //         "itemStyle": {
    //             "normal": {
    //                 "borderWidth": 0,
    //                 "borderColor": "#ccc"
    //             },
    //             "emphasis": {
    //                 "borderWidth": 0,
    //                 "borderColor": "#ccc"
    //             }
    //         }
    //     },
    //     "funnel": {
    //         "itemStyle": {
    //             "normal": {
    //                 "borderWidth": 0,
    //                 "borderColor": "#ccc"
    //             },
    //             "emphasis": {
    //                 "borderWidth": 0,
    //                 "borderColor": "#ccc"
    //             }
    //         }
    //     },
    //     "gauge": {
    //         "itemStyle": {
    //             "normal": {
    //                 "borderWidth": 0,
    //                 "borderColor": "#ccc"
    //             },
    //             "emphasis": {
    //                 "borderWidth": 0,
    //                 "borderColor": "#ccc"
    //             }
    //         }
    //     },
    //     "candlestick": {
    //         "itemStyle": {
    //             "normal": {
    //                 "color": "#c23531",
    //                 "color0": "#314656",
    //                 "borderColor": "#c23531",
    //                 "borderColor0": "#314656",
    //                 "borderWidth": 1
    //             }
    //         }
    //     },
    //     "graph": {
    //         "itemStyle": {
    //             "normal": {
    //                 "borderWidth": 0,
    //                 "borderColor": "#ccc"
    //             }
    //         },
    //         "lineStyle": {
    //             "normal": {
    //                 "width": 1,
    //                 "color": "#aaa"
    //             }
    //         },
    //         "symbolSize": 4,
    //         "symbol": "emptyCircle",
    //         "smooth": false,
    //         "color": [
    //             "#c23531",
    //             "#2f4554",
    //             "#61a0a8",
    //             "#d48265",
    //             "#91c7ae",
    //             "#749f83",
    //             "#ca8622",
    //             "#bda29a",
    //             "#6e7074",
    //             "#546570",
    //             "#c4ccd3"
    //         ],
    //         "label": {
    //             "normal": {
    //                 "textStyle": {
    //                     "color": "#eee"
    //                 }
    //             }
    //         }
    //     },
    //     "map": {
    //         "itemStyle": {
    //             "normal": {
    //                 "areaColor": "#eee",
    //                 "borderColor": "#444",
    //                 "borderWidth": 0.5
    //             },
    //             "emphasis": {
    //                 "areaColor": "rgba(255,215,0,0.8)",
    //                 "borderColor": "#444",
    //                 "borderWidth": 1
    //             }
    //         },
    //         "label": {
    //             "normal": {
    //                 "textStyle": {
    //                     "color": "#000"
    //                 }
    //             },
    //             "emphasis": {
    //                 "textStyle": {
    //                     "color": "rgb(100,0,0)"
    //                 }
    //             }
    //         }
    //     },
    //     "geo": {
    //         "itemStyle": {
    //             "normal": {
    //                 "areaColor": "#eee",
    //                 "borderColor": "#444",
    //                 "borderWidth": 0.5
    //             },
    //             "emphasis": {
    //                 "areaColor": "rgba(255,215,0,0.8)",
    //                 "borderColor": "#444",
    //                 "borderWidth": 1
    //             }
    //         },
    //         "label": {
    //             "normal": {
    //                 "textStyle": {
    //                     "color": "#000"
    //                 }
    //             },
    //             "emphasis": {
    //                 "textStyle": {
    //                     "color": "rgb(100,0,0)"
    //                 }
    //             }
    //         }
    //     },
    //     "categoryAxis": {
    //         "axisLine": {
    //             "show": true,
    //             "lineStyle": {
    //                 "color": "#333"
    //             }
    //         },
    //         "axisTick": {
    //             "show": true,
    //             "lineStyle": {
    //                 "color": "#333"
    //             }
    //         },
    //         "axisLabel": {
    //             "show": true,
    //             "textStyle": {
    //                 "color": "#333"
    //             }
    //         },
    //         "splitLine": {
    //             "show": false,
    //             "lineStyle": {
    //                 "color": [
    //                     "#ccc"
    //                 ]
    //             }
    //         },
    //         "splitArea": {
    //             "show": false,
    //             "areaStyle": {
    //                 "color": [
    //                     "rgba(250,250,250,0.3)",
    //                     "rgba(200,200,200,0.3)"
    //                 ]
    //             }
    //         }
    //     },
    //     "valueAxis": {
    //         "axisLine": {
    //             "show": true,
    //             "lineStyle": {
    //                 "color": "#333"
    //             }
    //         },
    //         "axisTick": {
    //             "show": true,
    //             "lineStyle": {
    //                 "color": "#333"
    //             }
    //         },
    //         "axisLabel": {
    //             "show": true,
    //             "textStyle": {
    //                 "color": "#333"
    //             }
    //         },
    //         "splitLine": {
    //             "show": true,
    //             "lineStyle": {
    //                 "color": [
    //                     "#ccc"
    //                 ]
    //             }
    //         },
    //         "splitArea": {
    //             "show": false,
    //             "areaStyle": {
    //                 "color": [
    //                     "rgba(250,250,250,0.3)",
    //                     "rgba(200,200,200,0.3)"
    //                 ]
    //             }
    //         }
    //     },
    //     "logAxis": {
    //         "axisLine": {
    //             "show": true,
    //             "lineStyle": {
    //                 "color": "#333"
    //             }
    //         },
    //         "axisTick": {
    //             "show": true,
    //             "lineStyle": {
    //                 "color": "#333"
    //             }
    //         },
    //         "axisLabel": {
    //             "show": true,
    //             "textStyle": {
    //                 "color": "#333"
    //             }
    //         },
    //         "splitLine": {
    //             "show": true,
    //             "lineStyle": {
    //                 "color": [
    //                     "#ccc"
    //                 ]
    //             }
    //         },
    //         "splitArea": {
    //             "show": false,
    //             "areaStyle": {
    //                 "color": [
    //                     "rgba(250,250,250,0.3)",
    //                     "rgba(200,200,200,0.3)"
    //                 ]
    //             }
    //         }
    //     },
    //     "timeAxis": {
    //         "axisLine": {
    //             "show": true,
    //             "lineStyle": {
    //                 "color": "#333"
    //             }
    //         },
    //         "axisTick": {
    //             "show": true,
    //             "lineStyle": {
    //                 "color": "#333"
    //             }
    //         },
    //         "axisLabel": {
    //             "show": true,
    //             "textStyle": {
    //                 "color": "#333"
    //             }
    //         },
    //         "splitLine": {
    //             "show": true,
    //             "lineStyle": {
    //                 "color": [
    //                     "#ccc"
    //                 ]
    //             }
    //         },
    //         "splitArea": {
    //             "show": false,
    //             "areaStyle": {
    //                 "color": [
    //                     "rgba(250,250,250,0.3)",
    //                     "rgba(200,200,200,0.3)"
    //                 ]
    //             }
    //         }
    //     },
    //     "toolbox": {
    //         "iconStyle": {
    //             "normal": {
    //                 "borderColor": "#999"
    //             },
    //             "emphasis": {
    //                 "borderColor": "#666"
    //             }
    //         }
    //     },
    //     "legend": {
    //         "textStyle": {
    //             "color": "#333"
    //         }
    //     },
    //     "tooltip": {
    //         "axisPointer": {
    //             "lineStyle": {
    //                 "color": "#ccc",
    //                 "width": 1
    //             },
    //             "crossStyle": {
    //                 "color": "#ccc",
    //                 "width": 1
    //             }
    //         }
    //     },
    //     "timeline": {
    //         "lineStyle": {
    //             "color": "#293c55",
    //             "width": 1
    //         },
    //         "itemStyle": {
    //             "normal": {
    //                 "color": "#293c55",
    //                 "borderWidth": 1
    //             },
    //             "emphasis": {
    //                 "color": "#a9334c"
    //             }
    //         },
    //         "controlStyle": {
    //             "normal": {
    //                 "color": "#293c55",
    //                 "borderColor": "#293c55",
    //                 "borderWidth": 0.5
    //             },
    //             "emphasis": {
    //                 "color": "#293c55",
    //                 "borderColor": "#293c55",
    //                 "borderWidth": 0.5
    //             }
    //         },
    //         "checkpointStyle": {
    //             "color": "#e43c59",
    //             "borderColor": "rgba(194,53,49, 0.5)"
    //         },
    //         "label": {
    //             "normal": {
    //                 "textStyle": {
    //                     "color": "#293c55"
    //                 }
    //             },
    //             "emphasis": {
    //                 "textStyle": {
    //                     "color": "#293c55"
    //                 }
    //             }
    //         }
    //     },
    //     "visualMap": {
    //         "color": [
    //             "#bf444c",
    //             "#d88273",
    //             "#f6efa6"
    //         ]
    //     },
    //     "dataZoom": {
    //         "backgroundColor": "rgba(47,69,84,0)",
    //         "dataBackgroundColor": "rgba(47,69,84,0.3)",
    //         "fillerColor": "rgba(167,183,204,0.4)",
    //         "handleColor": "#a7b7cc",
    //         "handleSize": "100%",
    //         "textStyle": {
    //             "color": "#333"
    //         }
    //     },
    //     "markPoint": {
    //         "label": {
    //             "normal": {
    //                 "textStyle": {
    //                     "color": "#eee"
    //                 }
    //             },
    //             "emphasis": {
    //                 "textStyle": {
    //                     "color": "#eee"
    //                 }
    //             }
    //         }
    //     }
    // };

    @Input() formControl: FormControl;
    @Input() field: FormComponent<any>;

    constructor(
        private renderer2: Renderer2
    ) { }

    writeValue(obj: any): void {
        // throw new Error("Method not implemented.");
    }

    registerOnChange(fn: any): void {
        // throw new Error("Method not implemented.");
    }

    registerOnTouched(fn: any): void {
        // throw new Error("Method not implemented.");
    }

    ngOnInit(): void {
        // console.warn('field: ', this.field);

        // var myChart = echarts.init(document.getElementById('formql-charts'), this.customed);//默认返回echar对象
        // const options = this.options(this.field.value.title, this.field.value.tooltip, this.field.value.legendData,
        //     this.field.value.xAxis, this.field.value.yAxis, this.field.value.series, this.field.value.color);
        // myChart.setOption(options);
        // console.log(myChart);

        this.chartsOptions = this.options(this.field.value.title, this.field.value.tooltip, this.field.value.legendData,
            this.field.value.xAxis, this.field.value.yAxis, this.field.value.series, this.field.value.color);

    }

    addTheme(path) {
        if (path) {
            // const node1 = this.renderer2.createElement('script');
            // node1.src = "https://lib.baomitu.com/echarts/4.6.0/echarts.min.js";
            // this.renderer2.appendChild(document.getElementsByTagName('head')[0], node1);
            const node = this.renderer2.createElement('script');
            node.src = path;
            this.renderer2.appendChild(document.getElementsByTagName('head')[0], node);
        }
    }

    /**
     * 图表设置
     * @param title 图表名称
     * @param tooltip 鼠标浮动显示
     * @param legend 图例
     * @param xAxis 横坐标数据
     * @param yAxis 纵坐标数据 可不传
     * @param series 图表数据
     * @param color 颜色
     */
    options(title, tooltip, legendData, xAxis, yAxis, series, color) {
        const isXAxisShow = xAxis ? true : false;
        const resultOption = {
            title: {
                show: title ? true : false,
                text: title,
                left: 'center'
            },
            grid: {
                top: 20,
                left: 0,
                right: 0,
                bottom: '10%',
                containLabel: true,
            },
            tooltip: tooltip ? tooltip : {
                trigger: 'item',
            },
            legend: {
                show: legendData ? true : false,
                data: legendData,
                x: 'center',
                y: 'bottom',
            },
            xAxis: {
                show: isXAxisShow,
                type: 'category',
                data: xAxis,
            },
            yAxis: yAxis ? yAxis : {
                show: isXAxisShow,
                type: 'value'
            },
            series,
            // color: color ? color : ["#FFB6C1", "#AFEEEE", "#F0E68C"],
        };
        return resultOption;
    }

}
