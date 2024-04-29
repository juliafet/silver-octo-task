import { FacetFilterGroup } from '../FacetFilterGroup'
import { Loading } from '../Loading'
import { SelectView } from './SelectView'
import { PatentList } from './PatentList'
import { TermsAggregation } from '../../models/TermsAggregation'
import { PatentSearchResponse } from '../../models/PatentSearchResponse'
import { PatentTermsAggregationKey } from '../../models/PatentTermsAggregationKey'
import { PatentTermsAggregationLabels } from '../../models/PatentTermsAggregationLabels'
import { SearchView } from '../../models/SearchView'
import { useLensStore } from '../../store'
import { BigMessage } from '../ui/BigMessage'

type PatentResultsProps = {
  fetching: boolean
  loading?: boolean
  response?: PatentSearchResponse
}

export function PatentResults({ response, loading }: PatentResultsProps) {
  const view = useLensStore((d) => d.view)
  const facetKeys = [PatentTermsAggregationKey.PublicationType, PatentTermsAggregationKey.LegalStatus, PatentTermsAggregationKey.Jurisdiction]

  if (loading) return <Loading />
  if (!response) return <BigMessage>No results</BigMessage>

  return (
    <div className="grid-flow-row grid-cols-12 gap-2 md:grid">
      <aside className="md:col-span-3 xl:col-span-2">
        {response?.aggregations &&
          facetKeys.map((k) => (
            <FacetFilterGroup
              key={k}
              aggregation={response.aggregations[k] as TermsAggregation}
              label={PatentTermsAggregationLabels[k]}
            />
          ))}
      </aside>
      <div className={'col-span-8'}>
        <div className={'flex p-2 justify-between'}>
          <h4 className={'font-bold'}>
            Patents
            <span className="ml-1">
              ({response?.totalRelation === 'gte' && 'over '}
              {response?.totalHits?.toLocaleString()})
            </span>
          </h4>
          <SelectView />
        </div>
        {view === SearchView.List && <PatentList response={response} />}
      </div>
    </div>
  )
}
