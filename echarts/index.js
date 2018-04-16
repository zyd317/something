/**
 * Created by yidi.zhao on 2018/4/16.
 *
 * 被js引入的css，会因为webpack的配置new ExtractTextPlugin("styles.css") 被自动加上前缀之后打包成styles.css
 */
import PriceTrend from './js/price';
import data from './js/data.js';

import '../reset.scss';
import './index.scss';

new PriceTrend().setData(data.lowPriceList, data.priceTrendDetailInfo);