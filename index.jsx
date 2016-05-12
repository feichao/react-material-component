import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { render } from 'react-dom';

import BSelect from './src/bselect/bselect.jsx';
import Color from './src/color/color.jsx';
import Datetime from './src/datetime/datetime.jsx';
import MultiSelect from './src/multiselect/multiselect.jsx';
import Paging from './src/paging/paging.jsx';
import Tag from './src/tag/tag.jsx';

injectTapEventPlugin();

class Index extends React.Component {
    constructor(props) {
      super(props);
      this.displayName = 'Index';

      this.onSelectedChange = this.onSelectedChange.bind(this);
      this.onPagingClick = this.onPagingClick.bind(this);

      this.selectedOptions = [{
        label: 'Music',
        value: '1'
      }, {
        label: 'Movie',
        value: '2'
      }, {
        label: 'Game',
        value: '3'
      }, {
        label: 'TV',
        value: '4'
      }, {
        label: 'MV',
        value: '5'
      }, {
        label: 'Cartoon',
        value: '6'
      }, {
        label: 'Variety',
        value: '7'
      }, {
        label: 'Sketch',
        value: '8'
      }];
    }

    onSelectedChange(value) {

    }

    onPagingClick() {

    }

    render() {
      return (
        <div>
          <div className='block'>
            <h3>BSelect</h3>
            <BSelect label='按钮组'
              checkList={this.selectedOptions} 
              defaultValue={1}
              value={this.selected}
              onChange={this.onSelectedChange} />
            <BSelect label='按钮组（多选）'
              checkList={this.selectedOptions}
              multi={true}
              defaultValue={[1]}
              value={this.selected}
              onChange={this.onSelectedChange} />
          </div>

          <div className='block'>
            <h3>Color</h3>
            <Color input={{
              name: 'bgColor',
              defaultValue: '#b82828',
              validate: {
                required: true
              }
            }} />
          </div>

          <div className='block'>
            <h3>Datetime</h3>
            <Datetime input={{
              name: 'startDate',
              defaultValue: '2016-03-14 12:34:56',
              validate: {
                required: true,
                maxDate: '2016-03-16',
                minDate: '2016-03-10'
              }
            }} />

            <Datetime input={{
              name: 'startDate',
              defaultValue: '2016-03-14'
            }} time={false} />

            <Datetime input={{
              name: 'startDate',
              defaultValue: '12:34:56'
            }} date={false} />
          </div>

          <div className='block'>
            <h3>MultiSelect</h3>
              <MultiSelect input={{
                name: 'mymultiselect',
                placeholder: '输入关键字查询',
                defaultValue: '1',
                options: this.selectedOptions,
                validate: {
                  required: true,
                  maxCount: 3,
                  minCount: 2
                }
              }} />
          </div>

          <div className='block'>
            <h3>Paging</h3>
            <Paging info={{
                total: 1000,
                index: 0,
                pagesize: 10
              }} handleClick={this.onPagingClick} />
          </div>

          <div className='block'>
            <h3>Tag</h3>
            <Tag input={{
              title: '标签',
              name: 'tag',
              defaultValue: 'Movie++Music++TV',
              validate: {
                required: true,
                maxCount: 4,
                minCount: 2
              }
            }} />
          </div>
          
        </div>
      );
    }
}

export default Index;


render(<Index />, document.getElementById('container'));

