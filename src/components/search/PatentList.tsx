import { Link } from 'raviger'
import { useState } from 'react'
import { PatentHit } from '../../models/PatentHit'
import { PatentSearchResponse } from '../../models/PatentSearchResponse'
import { PatentPills } from '../PatentPills'
import { CircleArrowUp } from 'lucide-react'
import { CircleArrowDown } from 'lucide-react'
import { Button } from '../ui/Button'

export const getTitle = (hit: PatentHit) => hit.document.title?.en?.at(0)?.text || ''
export const getClaims = (hit: PatentHit) => hit.document.claim?.en?.at(0)?.text || ''

export function PatentList({ response }: { response: PatentSearchResponse }) {
  return (
    <div className={'divide-y divide-solid border'}>
      {response?.hits.map((hit, i) => {
        const isEven = i % 2 === 0
        return <PatentListItem hit={hit} zebra={isEven} />
      })}
    </div>
  )
}

export function PatentListItem({ hit, zebra }: { hit: PatentHit; zebra?: boolean }) {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const getPreview = () => {
    setIsPreviewVisible(isVisible => !isVisible);
  };

  const className = zebra ? '' : 'bg-slate-100 dark:bg-[#26323b]'
  return (
    <div key={hit.document.record_lens_id} className={`block p-3 cursor-pointer ${className}`}>
      <Button variant="ghost" size="icon" onClick={getPreview}>
        {isPreviewVisible ? <CircleArrowUp /> : <CircleArrowDown />}
      </Button>
      <Link href={`/patent/${hit.document.record_lens_id}`}>
        <h4 className={'text-lg'}>{getTitle(hit)}</h4>
      </Link>
      <div className={'py-2'}>
        <PatentPills doc={hit.document} />
      </div>
      <div className={'capitalize py-2 text-sm'}>{hit.document.publication_type}</div>
      <div className={'py-2 text-sm'}>
        Published: {hit.document.date_published || hit.document.year_published || 'unknown'}
      </div>
      <div>
        <small>Inventors: </small>
        {hit.document.inventor?.map((inventor) => <small key={inventor.name}>{inventor.name} </small>)}
      </div>
      <div>
        <small>Applicants: </small>
        {hit.document.applicant?.map((applicant) => <small key={applicant.name}>{applicant.name} </small>)}
      </div>
      {isPreviewVisible && 
      <div className={'d-flex justify-content-evenly'} >
        <div className={'capitalize py-2 text-sm border-top-secondary-4'}>
            <h5>Abstract:</h5>
            <ul>
                {hit.document.abstract?.en.map((en) =>
                <li className={'list-group-item pt-2 ps-2'} key={en.text}>
                    <small>{en.text}</small>
                </li>)}
            </ul>
        </div>
        <div className={'capitalize py-2 text-sm'}>
            <h5>Claims:</h5>
            {getClaims(hit) ?
                <ol>
                    {hit.document.claim.en?.map((en) => <li className={'list-group-item pt-2 ps-2'} key={en.text}><small>{en.text}</small></li>)}
                </ol>
                : <small className={'text-white-50 pt-2 ps-2'} style={{opacity: '.5'}}>
                    Information currently unavailable.
                  </small>
            }
        </div>
      </div>}
    </div>
  )
}
