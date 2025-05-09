<Box>
     <Plot
        data={[
          {
            //x: result?.gmeta?.map((x) => x?.entries[0]?.content?.name?.run-parameters?.sampling-freq-mega-hz),
            //x: [1, 2, 3],
            //y: [2, 6, 3],
            y: result?.gmeta?.map((x) => x?.entries[0]?.content?.name),
            type: 'scatter',
            mode: 'markers',
            marker: {color: 'red'},
          },
          {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        ]}
        layout={ {width: 500, height: 240, title: {text: 'A Fancy Plot'}} }
      />

     </Box>