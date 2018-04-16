/**
 * Created by yidi.zhao on 2018/4/16.
 *
 * css资源在js中引入会被webpack直接打包成js入口的同名文件，不需要再配置css的入口
 */
import PriceTrend from './js/price';
import data from './js/data.js';

import '../reset.scss';
import './index.scss';

new PriceTrend().setData(data.lowPriceList, data.priceTrendDetailInfo);